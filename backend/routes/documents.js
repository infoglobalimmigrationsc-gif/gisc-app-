// backend/routes/documents.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Document = require('../models/Document');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Configure S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload document
router.post('/upload', authMiddleware, upload.single('document'), async (req, res) => {
  try {
    const { type } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Upload to S3
    const key = `documents/${req.userId}/${type}/${Date.now()}_${file.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    
    await s3Client.send(command);
    
    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    // Save document record
    const document = new Document({
      userId: req.userId,
      type,
      name: file.originalname,
      url: fileUrl,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
    });
    
    await document.save();
    
    // Update user documents
    await User.findByIdAndUpdate(req.userId, {
      $set: { [`documents.${type}`]: fileUrl },
    });
    
    res.json({ 
      success: true, 
      document: {
        id: document._id,
        name: document.name,
        url: document.url,
      },
      message: 'Document uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user documents
router.get('/', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.userId });
    
    const docsByType = {};
    documents.forEach(doc => {
      if (!docsByType[doc.type]) {
        docsByType[doc.type] = [];
      }
      docsByType[doc.type].push({
        id: doc._id,
        name: doc.name,
        url: doc.url,
        uploadedAt: doc.uploadedAt,
      });
    });
    
    res.json({ success: true, documents: docsByType });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete document
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    
    // Remove from user documents
    await User.findByIdAndUpdate(req.userId, {
      $unset: { [`documents.${document.type}`]: '' },
    });
    
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
