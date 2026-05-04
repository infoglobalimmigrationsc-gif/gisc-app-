// frontend/src/screens/application/DocumentUploadScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://api.gisc-liberia.com/api';

const DOCUMENT_TYPES = [
  {
    id: 'passport',
    label: 'International Passport',
    description: 'Data page showing photo and details',
    icon: 'id-card-outline',
    required: true,
    acceptedTypes: ['image/*', 'application/pdf'],
    maxSize: 5, // MB
  },
  {
    id: 'certificates',
    label: 'Academic Certificates',
    description: 'WAEC, Bachelor\'s, Master\'s, etc.',
    icon: 'document-text-outline',
    required: true,
    acceptedTypes: ['image/*', 'application/pdf'],
    maxSize: 10,
    multiple: true,
  },
  {
    id: 'transcript',
    label: 'Academic Transcript',
    description: 'Official transcript from institution',
    icon: 'document-outline',
    required: true,
    acceptedTypes: ['image/*', 'application/pdf'],
    maxSize: 10,
  },
  {
    id: 'cv',
    label: 'CV / Resume',
    description: 'Updated curriculum vitae',
    icon: 'briefcase-outline',
    required: false,
    acceptedTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
    maxSize: 5,
  },
  {
    id: 'photo',
    label: 'Passport Photograph',
    description: 'Recent passport-sized photo',
    icon: 'camera-outline',
    required: true,
    acceptedTypes: ['image/*'],
    maxSize: 2,
  },
];

const DocumentUploadScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentUpload, setCurrentUpload] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    loadExistingDocuments();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('Permissions Required', 'Please grant camera and storage permissions to upload documents.');
    }
  };

  const loadExistingDocuments = async () => {
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      const response = await axios.get(`${API_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleSelectDocument = (docType) => {
    Alert.alert(
      'Upload Document',
      `Choose upload method for ${DOCUMENT_TYPES.find(d => d.id === docType)?.label}`,
      [
        { text: 'Take Photo', onPress: () => handleTakePhoto(docType) },
        { text: 'Choose from Gallery', onPress: () => handlePickDocument(docType) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleTakePhoto = async (docType) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadDocument(docType, result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickDocument = async (docType) => {
    try {
      const docConfig = DOCUMENT_TYPES.find(d => d.id === docType);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: docConfig.acceptedTypes,
        multiple: docConfig.multiple || false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        for (const asset of result.assets) {
          // Check file size
          if (asset.size > docConfig.maxSize * 1024 * 1024) {
            Alert.alert(
              'File Too Large',
              `Maximum file size is ${docConfig.maxSize}MB`
            );
            continue;
          }
          
          await uploadDocument(docType, asset);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const uploadDocument = async (docType, file) => {
    setUploading(true);
    setCurrentUpload(docType);
    
    const formData = new FormData();
    formData.append('document', {
      uri: file.uri,
      type: file.mimeType || 'application/octet-stream',
      name: file.name || `document_${Date.now()}`,
    });
    formData.append('type', docType);

    try {
      const token = await AsyncStorage.getItem('gisc_token');
      
      const response = await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress({ ...uploadProgress, [docType]: percentCompleted });
        },
      });

      if (response.data.success) {
        setDocuments({
          ...documents,
          [docType]: response.data.document,
        });
        
        Alert.alert('Success', 'Document uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Upload Failed', error.response?.data?.message || 'Please try again.');
    } finally {
      setUploading(false);
      setCurrentUpload(null);
      setUploadProgress({ ...uploadProgress, [docType]: 0 });
    }
  };

  const handleDeleteDocument = (docType, docIndex) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('gisc_token');
              const docId = Array.isArray(documents[docType]) 
                ? documents[docType][docIndex]?.id 
                : documents[docType]?.id;

              await axios.delete(`${API_URL}/documents/${docId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (Array.isArray(documents[docType])) {
                const newDocs = documents[docType].filter((_, i) => i !== docIndex);
                setDocuments({ ...documents, [docType]: newDocs });
              } else {
                const newDocs = { ...documents };
                delete newDocs[docType];
                setDocuments(newDocs);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete document.');
            }
          },
        },
      ]
    );
  };

  const handlePreview = (url) => {
    setPreviewUrl(url);
    setShowPreview(true);
  };

  const getUploadStatus = (docType) => {
    const doc = documents[docType];
    if (!doc) return 'pending';
    if (Array.isArray(doc) && doc.length === 0) return 'pending';
    return 'uploaded';
  };

  const getStatusIcon = (docType) => {
    const status = getUploadStatus(docType);
    const isRequired = DOCUMENT_TYPES.find(d => d.id === docType)?.required;
    
    if (status === 'uploaded') {
      return <Ionicons name="checkmark-circle" size={22} color="#27AE60" />;
    } else if (isRequired) {
      return <Ionicons name="alert-circle" size={22} color="#E74C3C" />;
    } else {
      return <Ionicons name="time-outline" size={22} color="#F39C12" />;
    }
  };

  const calculateCompletion = () => {
    const requiredDocs = DOCUMENT_TYPES.filter(d => d.required);
    const uploadedRequired = requiredDocs.filter(d => {
      const doc = documents[d.id];
      return doc && (!Array.isArray(doc) || doc.length > 0);
    });
    return Math.round((uploadedRequired.length / requiredDocs.length) * 100);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Upload Progress</Text>
          <Text style={styles.progressPercent}>{calculateCompletion()}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${calculateCompletion()}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Required Documents</Text>
        <Text style={styles.sectionSubtitle}>
          Please upload clear, legible copies of all required documents
        </Text>

        {DOCUMENT_TYPES.map((docType) => {
          const status = getUploadStatus(docType.id);
          const uploadedDoc = documents[docType.id];
          const isUploading = uploading && currentUpload === docType.id;
          const progress = uploadProgress[docType.id] || 0;

          return (
            <View key={docType.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={styles.documentIconContainer}>
                  <Ionicons name={docType.icon} size={24} color="#1E3A5F" />
                </View>
                <View style={styles.documentInfo}>
                  <View style={styles.documentTitleRow}>
                    <Text style={styles.documentTitle}>{docType.label}</Text>
                    {docType.required && (
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredText}>Required</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.documentDescription}>{docType.description}</Text>
                  <Text style={styles.documentRequirements}>
                    Max size: {docType.maxSize}MB • {docType.acceptedTypes.join(', ')}
                  </Text>
                </View>
                {getStatusIcon(docType.id)}
              </View>

              {/* Uploaded Files */}
              {status === 'uploaded' && (
                <View style={styles.uploadedFiles}>
                  {Array.isArray(uploadedDoc) ? (
                    uploadedDoc.map((file, index) => (
                      <View key={index} style={styles.fileItem}>
                        <TouchableOpacity 
                          style={styles.fileInfo}
                          onPress={() => handlePreview(file.url)}
                        >
                          <Ionicons name="document-text" size={20} color="#5A7D9C" />
                          <Text style={styles.fileName} numberOfLines={1}>
                            {file.name || `Document ${index + 1}`}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteDocument(docType.id, index)}>
                          <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <View style={styles.fileItem}>
                      <TouchableOpacity 
                        style={styles.fileInfo}
                        onPress={() => handlePreview(uploadedDoc.url)}
                      >
                        <Ionicons name="document-text" size={20} color="#5A7D9C" />
                        <Text style={styles.fileName} numberOfLines={1}>
                          {uploadedDoc.name || 'Uploaded Document'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteDocument(docType.id, 0)}>
                        <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* Upload Button / Progress */}
              {isUploading ? (
                <View style={styles.uploadProgress}>
                  <View style={styles.progressBarSmall}>
                    <View style={[styles.progressFillSmall, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>Uploading... {progress}%</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.uploadButton,
                    docType.multiple && status === 'uploaded' && styles.uploadButtonSecondary,
                  ]}
                  onPress={() => handleSelectDocument(docType.id)}
                >
                  <Ionicons 
                    name={status === 'uploaded' && !docType.multiple ? 'checkmark' : 'cloud-upload-outline'} 
                    size={18} 
                    color={status === 'uploaded' && !docType.multiple ? '#27AE60' : '#1E3A5F'} 
                  />
                  <Text style={[
                    styles.uploadButtonText,
                    status === 'uploaded' && !docType.multiple && { color: '#27AE60' },
                  ]}>
                    {status === 'uploaded' 
                      ? (docType.multiple ? 'Upload Another' : 'Uploaded')
                      : 'Upload Document'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Important Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Important Notes</Text>
          <View style={styles.noteItem}>
            <Ionicons name="information-circle" size={16} color="#F39C12" />
            <Text style={styles.noteText}>
              All documents must be clear and legible
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Ionicons name="information-circle" size={16} color="#F39C12" />
            <Text style={styles.noteText}>
              Maximum file size per document: {DOCUMENT_TYPES.map(d => `${d.label}: ${d.maxSize}MB`).join(', ')}
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Ionicons name="information-circle" size={16} color="#F39C12" />
            <Text style={styles.noteText}>
              Accepted formats: PDF, JPG, PNG, DOC, DOCX
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            calculateCompletion() < 100 && styles.submitButtonDisabled,
          ]}
          onPress={() => {
            if (calculateCompletion() === 100) {
              Alert.alert(
                'Documents Complete',
                'All required documents have been uploaded. Your application will now move to review.',
                [{ text: 'Continue', onPress: () => navigation.navigate('ApplicationTracker') }]
              );
            } else {
              Alert.alert(
                'Missing Documents',
                'Please upload all required documents before proceeding.'
              );
            }
          }}
        >
          <Text style={styles.submitButtonText}>
            {calculateCompletion() === 100 ? 'Submit Documents' : 'Upload All Required Documents'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Preview Modal */}
      <Modal
        visible={showPreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Document Preview</Text>
            <TouchableOpacity onPress={() => setShowPreview(false)}>
              <Ionicons name="close" size={24} color="#1E3A5F" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            {/* Document preview would be rendered here */}
            <Text style={styles.previewPlaceholder}>Document Preview</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFCFE',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF5',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E3A5F',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27AE60',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8EEF5',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#27AE60',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
    marginTop: 20,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#8AA0B8',
    marginBottom: 20,
  },
  documentCard: {
    backgroundColor: '#FAFCFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  documentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EBF3FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E3A5F',
    marginRight: 8,
  },
  requiredBadge: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  documentDescription: {
    fontSize: 13,
    color: '#5A7D9C',
    marginBottom: 4,
  },
  documentRequirements: {
    fontSize: 11,
    color: '#8AA0B8',
  },
  uploadedFiles: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF5',
    paddingTop: 14,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 14,
    color: '#1E3A5F',
    marginLeft: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF3FA',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 14,
  },
  uploadButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E3A5F',
    marginLeft: 8,
  },
  uploadProgress: {
    marginTop: 14,
  },
  progressBarSmall: {
    height: 4,
    backgroundColor: '#E8EEF5',
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFillSmall: {
    height: 4,
    backgroundColor: '#1E3A5F',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#5A7D9C',
    textAlign: 'center',
  },
  notesContainer: {
    backgroundColor: '#FEF9E7',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  notesTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#5A7D9C',
    marginLeft: 10,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#8AA0B8',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPlaceholder: {
    fontSize: 16,
    color: '#8AA0B8',
  },
});

export default DocumentUploadScreen;
