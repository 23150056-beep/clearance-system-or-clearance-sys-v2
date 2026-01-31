import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useData } from '../context/DataContext';

export default function StudentDashboard() {
  const { currentUser, logout, getCurrentStudent, submitRequirement } = useData();
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const student = getCurrentStudent() || currentUser;

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'submitted': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'submitted': return 'hourglass';
      case 'rejected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getDepartmentIcon = (dept) => {
    const icons = {
      'Library': 'library',
      'Laboratory': 'flask',
      'Finance': 'cash',
      'Registrar': 'document-text',
      'Student Affairs': 'people',
      'Department': 'school',
    };
    return icons[dept] || 'folder';
  };

  const openUploadModal = (requirement) => {
    setSelectedRequirement(requirement);
    setSelectedImage(null);
    setUploadModal(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select or take a photo first');
      return;
    }

    setUploading(true);

    setTimeout(() => {
      submitRequirement(student.id, selectedRequirement.id, {
        name: `submission_${Date.now()}.jpg`,
        type: 'image',
        uri: selectedImage.uri,
      });

      setUploading(false);
      setUploadModal(false);
      setSelectedImage(null);
      Alert.alert('Success', 'Your document has been submitted for review!');
    }, 1500);
  };

  const getProgress = () => {
    if (!student?.requirements) return 0;
    const approved = student.requirements.filter(r => r.status === 'approved').length;
    return Math.round((approved / student.requirements.length) * 100);
  };

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error loading student data</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{student.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="id-card" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>{student.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="school" size={20} color="#2196F3" />
            <Text style={styles.infoText}>{student.course}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color="#9C27B0" />
            <Text style={styles.infoText}>{student.yearLevel}</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Clearance Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${getProgress()}%` }]} />
          </View>
          <Text style={styles.progressText}>{getProgress()}% Complete</Text>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#22c55e' }]}>
                {student.requirements?.filter(r => r.status === 'approved').length || 0}
              </Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#3b82f6' }]}>
                {student.requirements?.filter(r => r.status === 'submitted').length || 0}
              </Text>
              <Text style={styles.statLabel}>Pending Review</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
                {student.requirements?.filter(r => r.status === 'pending').length || 0}
              </Text>
              <Text style={styles.statLabel}>Not Started</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Requirements</Text>
        {student.requirements?.map((req) => (
          <View key={req.id} style={styles.requirementCard}>
            <View style={styles.reqHeader}>
              <View style={styles.reqDept}>
                <Ionicons name={getDepartmentIcon(req.department)} size={24} color="#4CAF50" />
                <Text style={styles.reqDeptText}>{req.department}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(req.status) + '20' }]}>
                <Ionicons name={getStatusIcon(req.status)} size={16} color={getStatusColor(req.status)} />
                <Text style={[styles.statusText, { color: getStatusColor(req.status) }]}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.reqDescription}>{req.description}</Text>
            <Text style={styles.reqDueDate}>Due: {req.dueDate}</Text>
            
            {req.remarks && (
              <View style={styles.remarksBox}>
                <Ionicons name="chatbubble" size={14} color="#a0aec0" />
                <Text style={styles.remarksText}>{req.remarks}</Text>
              </View>
            )}

            {(req.status === 'pending' || req.status === 'rejected') && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => openUploadModal(req)}
              >
                <Ionicons name="cloud-upload" size={20} color="#ffffff" />
                <Text style={styles.uploadButtonText}>
                  {req.status === 'rejected' ? 'Resubmit' : 'Upload Document'}
                </Text>
              </TouchableOpacity>
            )}

            {req.status === 'submitted' && (
              <View style={styles.submittedInfo}>
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text style={styles.submittedText}>Submitted - Awaiting Review</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={uploadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Document</Text>
              <TouchableOpacity onPress={() => setUploadModal(false)}>
                <Ionicons name="close" size={28} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {selectedRequirement && (
              <View style={styles.modalDeptInfo}>
                <Ionicons name={getDepartmentIcon(selectedRequirement.department)} size={30} color="#4CAF50" />
                <Text style={styles.modalDeptText}>{selectedRequirement.department}</Text>
                <Text style={styles.modalReqText}>{selectedRequirement.description}</Text>
              </View>
            )}

            <View style={styles.uploadOptions}>
              <TouchableOpacity style={styles.uploadOption} onPress={pickImage}>
                <Ionicons name="images" size={40} color="#3b82f6" />
                <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadOption} onPress={takePhoto}>
                <Ionicons name="camera" size={40} color="#22c55e" />
                <Text style={styles.uploadOptionText}>Take a Photo</Text>
              </TouchableOpacity>
            </View>

            {selectedImage && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="close-circle" size={28} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, !selectedImage && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!selectedImage || uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#ffffff" />
                  <Text style={styles.submitButtonText}>Submit for Review</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 14,
    color: '#a0aec0',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 12,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  progressTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressText: {
    color: '#a0aec0',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#a0aec0',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  requirementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reqDept: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reqDeptText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  reqDescription: {
    color: '#a0aec0',
    fontSize: 14,
    marginBottom: 8,
  },
  reqDueDate: {
    color: '#6b7280',
    fontSize: 12,
  },
  remarksBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  remarksText: {
    color: '#a0aec0',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  submittedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  submittedText: {
    color: '#3b82f6',
    fontSize: 13,
    marginLeft: 6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#16213e',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalDeptInfo: {
    alignItems: 'center',
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
  },
  modalDeptText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  modalReqText: {
    color: '#a0aec0',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  uploadOption: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    width: '45%',
  },
  uploadOptionText: {
    color: '#a0aec0',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  previewContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImage: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
