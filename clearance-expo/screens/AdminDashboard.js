import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

const { width } = Dimensions.get('window');

export default function AdminDashboard({ navigation }) {
  const { currentUser, logout, students, staff, getStatistics, departments } = useData();
  
  const stats = getStatistics();

  const handleLogout = () => {
    logout();
    navigation.replace('Landing');
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

  const getDepartmentColor = (index) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];
    return colors[index % colors.length];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Dashboard</Text>
          <Text style={styles.name}>{currentUser?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={[styles.overviewCard, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
              <Ionicons name="people" size={30} color="#4CAF50" />
              <Text style={styles.overviewNumber}>{stats.totalStudents}</Text>
              <Text style={styles.overviewLabel}>Total Students</Text>
            </View>
            <View style={[styles.overviewCard, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
              <Ionicons name="briefcase" size={30} color="#2196F3" />
              <Text style={styles.overviewNumber}>{staff.length}</Text>
              <Text style={styles.overviewLabel}>Staff Members</Text>
            </View>
            <View style={[styles.overviewCard, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
              <Ionicons name="checkmark-circle" size={30} color="#22c55e" />
              <Text style={styles.overviewNumber}>{stats.completedClearances}</Text>
              <Text style={styles.overviewLabel}>Completed</Text>
            </View>
            <View style={[styles.overviewCard, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="hourglass" size={30} color="#f59e0b" />
              <Text style={styles.overviewNumber}>{stats.pendingClearances}</Text>
              <Text style={styles.overviewLabel}>In Progress</Text>
            </View>
          </View>
        </View>

        {/* Completion Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Overall Completion Rate</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressCircleContainer}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercent}>
                  {stats.totalStudents > 0 
                    ? Math.round((stats.completedClearances / stats.totalStudents) * 100) 
                    : 0}%
                </Text>
              </View>
            </View>
            <View style={styles.progressLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                <Text style={styles.legendText}>Completed: {stats.completedClearances}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.legendText}>In Progress: {stats.pendingClearances}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Department Statistics */}
        <View style={styles.departmentSection}>
          <Text style={styles.sectionTitle}>Department Statistics</Text>
          {stats.departmentStats.map((dept, index) => (
            <View key={dept.department} style={styles.departmentCard}>
              <View style={styles.departmentHeader}>
                <View style={[styles.departmentIcon, { backgroundColor: getDepartmentColor(index) + '20' }]}>
                  <Ionicons 
                    name={getDepartmentIcon(dept.department)} 
                    size={24} 
                    color={getDepartmentColor(index)} 
                  />
                </View>
                <View style={styles.departmentInfo}>
                  <Text style={styles.departmentName}>{dept.department}</Text>
                  <Text style={styles.departmentStaff}>
                    {staff.find(s => s.department === dept.department)?.name || 'No staff assigned'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.departmentStats}>
                <View style={styles.miniStat}>
                  <Text style={[styles.miniStatNumber, { color: '#22c55e' }]}>{dept.approved}</Text>
                  <Text style={styles.miniStatLabel}>Approved</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={[styles.miniStatNumber, { color: '#3b82f6' }]}>{dept.pending}</Text>
                  <Text style={styles.miniStatLabel}>Pending</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={[styles.miniStatNumber, { color: '#ef4444' }]}>{dept.rejected}</Text>
                  <Text style={styles.miniStatLabel}>Rejected</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.deptProgressContainer}>
                <View style={styles.deptProgressBar}>
                  <View 
                    style={[
                      styles.deptProgressFill, 
                      { 
                        width: `${stats.totalStudents > 0 ? (dept.approved / stats.totalStudents) * 100 : 0}%`,
                        backgroundColor: getDepartmentColor(index)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.deptProgressText}>
                  {stats.totalStudents > 0 ? Math.round((dept.approved / stats.totalStudents) * 100) : 0}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity (Mock) */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#22c55e' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Library requirement approved for Maria Santos</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#3b82f6' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New submission from Juan Dela Cruz</Text>
                <Text style={styles.activityTime}>3 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#ef4444' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Finance requirement rejected for Maria Santos</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#4CAF50' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New student registered: Pedro Reyes</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="person-add" size={28} color="#4CAF50" />
              <Text style={styles.actionText}>Add Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="document-text" size={28} color="#2196F3" />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="settings" size={28} color="#9C27B0" />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="download" size={28} color="#FF9800" />
              <Text style={styles.actionText}>Export Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  overviewSection: {
    marginBottom: 25,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 5,
  },
  progressSection: {
    marginBottom: 25,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircleContainer: {
    marginRight: 20,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 8,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressLegend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    color: '#a0aec0',
    fontSize: 14,
  },
  departmentSection: {
    marginBottom: 25,
  },
  departmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  departmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  departmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  departmentStaff: {
    color: '#a0aec0',
    fontSize: 12,
    marginTop: 2,
  },
  departmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  miniStatLabel: {
    fontSize: 11,
    color: '#a0aec0',
    marginTop: 2,
  },
  deptProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deptProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  deptProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  deptProgressText: {
    color: '#a0aec0',
    fontSize: 12,
    width: 40,
    textAlign: 'right',
  },
  activitySection: {
    marginBottom: 25,
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: '#ffffff',
    fontSize: 14,
  },
  activityTime: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 3,
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    color: '#a0aec0',
    fontSize: 13,
    marginTop: 10,
  },
});
