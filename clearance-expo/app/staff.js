import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useData } from '../context/DataContext';

export default function StaffDashboard() {
  const { currentUser, logout, getStudentsByDepartment, updateRequirementStatus } = useData();
  const [filter, setFilter] = useState('all');
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [remarks, setRemarks] = useState('');

  const department = currentUser?.department;
  const students = getStudentsByDepartment(department);

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

  const filteredStudents = students.filter(student => {
    if (filter === 'all') return true;
    return student.departmentRequirement?.status === filter;
  });

  const pendingCount = students.filter(s => s.departmentRequirement?.status === 'submitted').length;

  const openReviewModal = (student) => {
    setSelectedStudent(student);
    setRemarks('');
    setReviewModal(true);
  };

  const handleApprove = () => {
    if (!selectedStudent) return;
    
    updateRequirementStatus(
      selectedStudent.id,
      selectedStudent.departmentRequirement.id,
      'approved',
      remarks || 'Approved by staff'
    );
    
    Alert.alert('Success', 'Requirement has been approved!');
    setReviewModal(false);
  };

  const handleReject = () => {
    if (!selectedStudent) return;
    
    if (!remarks.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }
    
    updateRequirementStatus(
      selectedStudent.id,
      selectedStudent.departmentRequirement.id,
      'rejected',
      remarks
    );
    
    Alert.alert('Rejected', 'Requirement has been rejected. Student will be notified.');
    setReviewModal(false);
  };

  const stats = {
    total: students.length,
    approved: students.filter(s => s.departmentRequirement?.status === 'approved').length,
    pending: students.filter(s => s.departmentRequirement?.status === 'pending').length,
    submitted: students.filter(s => s.departmentRequirement?.status === 'submitted').length,
    rejected: students.filter(s => s.departmentRequirement?.status === 'rejected').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Staff Dashboard</Text>
          <Text style={styles.name}>{currentUser?.name}</Text>
          <Text style={styles.department}>{department}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {pendingCount > 0 && (
          <View style={styles.alertBox}>
            <Ionicons name="alert-circle" size={24} color="#f59e0b" />
            <Text style={styles.alertText}>
              You have {pendingCount} submission{pendingCount > 1 ? 's' : ''} waiting for review
            </Text>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#4CAF50' }]}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#22c55e' }]}>
            <Text style={[styles.statNumber, { color: '#22c55e' }]}>{stats.approved}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
            <Text style={[styles.statNumber, { color: '#3b82f6' }]}>{stats.submitted}</Text>
            <Text style={styles.statLabel}>For Review</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
            <Text style={[styles.statNumber, { color: '#ef4444' }]}>{stats.rejected}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {['all', 'submitted', 'approved', 'pending', 'rejected'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Student Submissions</Text>
        {filteredStudents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={50} color="#6b7280" />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        ) : (
          filteredStudents.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={styles.studentCard}
              onPress={() => student.departmentRequirement?.status === 'submitted' && openReviewModal(student)}
              disabled={student.departmentRequirement?.status !== 'submitted'}
            >
              <View style={styles.studentHeader}>
                <View style={styles.studentInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentId}>{student.id}</Text>
                    <Text style={styles.studentCourse}>{student.course}</Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(student.departmentRequirement?.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(student.departmentRequirement?.status) }
                  ]}>
                    {student.departmentRequirement?.status?.toUpperCase()}
                  </Text>
                </View>
              </View>

              {student.departmentRequirement?.submission && (
                <View style={styles.submissionInfo}>
                  <Ionicons name="document-attach" size={16} color="#a0aec0" />
                  <Text style={styles.submissionText}>
                    {student.departmentRequirement.submission.fileName}
                  </Text>
                </View>
              )}

              {student.departmentRequirement?.remarks && (
                <View style={styles.remarksBox}>
                  <Text style={styles.remarksLabel}>Remarks:</Text>
                  <Text style={styles.remarksText}>{student.departmentRequirement.remarks}</Text>
                </View>
              )}

              {student.departmentRequirement?.status === 'submitted' && (
                <View style={styles.reviewPrompt}>
                  <Ionicons name="hand-right" size={16} color="#3b82f6" />
                  <Text style={styles.reviewPromptText}>Tap to review submission</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        visible={reviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Review Submission</Text>
              <TouchableOpacity onPress={() => setReviewModal(false)}>
                <Ionicons name="close" size={28} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <>
                <View style={styles.modalStudentInfo}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <Text style={styles.modalStudentName}>{selectedStudent.name}</Text>
                  <Text style={styles.modalStudentId}>{selectedStudent.id}</Text>
                  <Text style={styles.modalStudentCourse}>{selectedStudent.course}</Text>
                </View>

                {selectedStudent.departmentRequirement?.submission && (
                  <View style={styles.documentPreview}>
                    <Ionicons name="document" size={50} color="#4CAF50" />
                    <Text style={styles.documentName}>
                      {selectedStudent.departmentRequirement.submission.fileName}
                    </Text>
                    <Text style={styles.documentDate}>
                      Submitted: {selectedStudent.departmentRequirement.submittedAt || 'N/A'}
                    </Text>
                  </View>
                )}

                <View style={styles.remarksInput}>
                  <Text style={styles.remarksInputLabel}>Remarks (required for rejection)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your remarks..."
                    placeholderTextColor="#6b7280"
                    value={remarks}
                    onChangeText={setRemarks}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={handleApprove}
                  >
                    <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={handleReject}
                  >
                    <Ionicons name="close-circle" size={24} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    alignItems: 'flex-start',
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
  department: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 2,
  },
  logoutButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  alertText: {
    color: '#f59e0b',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterTabActive: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    color: '#a0aec0',
    fontSize: 12,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    marginTop: 10,
  },
  studentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  studentId: {
    color: '#a0aec0',
    fontSize: 12,
  },
  studentCourse: {
    color: '#6b7280',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  submissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  submissionText: {
    color: '#a0aec0',
    fontSize: 13,
    marginLeft: 8,
  },
  remarksBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  remarksLabel: {
    color: '#a0aec0',
    fontSize: 11,
    marginBottom: 4,
  },
  remarksText: {
    color: '#ffffff',
    fontSize: 13,
  },
  reviewPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  reviewPromptText: {
    color: '#3b82f6',
    fontSize: 13,
    marginLeft: 8,
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
  modalStudentInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalAvatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalStudentName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalStudentId: {
    color: '#a0aec0',
    fontSize: 14,
  },
  modalStudentCourse: {
    color: '#6b7280',
    fontSize: 13,
  },
  documentPreview: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  documentName: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 10,
  },
  documentDate: {
    color: '#a0aec0',
    fontSize: 12,
    marginTop: 5,
  },
  remarksInput: {
    marginBottom: 20,
  },
  remarksInputLabel: {
    color: '#a0aec0',
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    color: '#ffffff',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  approveButton: {
    backgroundColor: '#22c55e',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
