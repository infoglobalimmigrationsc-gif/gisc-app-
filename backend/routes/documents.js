const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(uploadDir, req.userId || 'anonymous');
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post('/upload', authMiddleware, upload.single('document'), async (req, res) => {
  try {
    const { type } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const document = new Document({
      userId: req.userId,
      type,
      name: file.originalname,
      url: `/uploads/${req.userId}/${file.filename}`,
      size: file.size,
      mimeType: file.mimetype,
    });

    await document.save();
    await User.findByIdAndUpdate(req.userId, { $set: { [`documents.${type}`]: document.url } });

    res.json({ success: true, document: { id: document._id, name: document.name, url: document.url, type: document.type } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  const docs = await Document.find({ userId: req.userId });
  const byType = {};
  docs.forEach(d => {
    if (!byType[d.type]) byType[d.type] = [];
    byType[d.type].push({ id: d._id, name: d.name, url: d.url, uploadedAt: d.uploadedAt });
  });
  res.json({ success: true, documents: byType });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  const fp = path.join(__dirname, '..', doc.url);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  res.json({ success: true });
});

module.exports = router;
