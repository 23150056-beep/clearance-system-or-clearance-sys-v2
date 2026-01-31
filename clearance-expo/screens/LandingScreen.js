import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

const courses = [
  'BS Computer Science',
  'BS Information Technology',
  'BS Computer Engineering',
  'BS Information Systems',
  'BS Data Science',
];

const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function LandingScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    course: courses[0],
    yearLevel: yearLevels[0],
    password: '',
    confirmPassword: '',
  });
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const { login, registerStudent } = useData();

  const roles = [
    { id: 'student', title: 'Student', icon: 'school', color: '#4CAF50', description: 'Access your clearance status' },
    { id: 'staff', title: 'Staff', icon: 'briefcase', color: '#2196F3', description: 'Manage student clearances' },
    { id: 'admin', title: 'Admin', icon: 'shield-checkmark', color: '#9C27B0', description: 'System administration' },
  ];

  const handleLogin = () => {
    if (!credentials.username || !credentials.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = login(selectedRole, credentials);

    if (result.success) {
      switch (selectedRole) {
        case 'student':
          navigation.replace('StudentDashboard');
          break;
        case 'staff':
          navigation.replace('StaffDashboard');
          break;
        case 'admin':
          navigation.replace('AdminDashboard');
          break;
      }
    } else {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  };

  const handleRegister = () => {
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const result = registerStudent(registerData);

    if (result.success) {
      Alert.alert(
        'Success',
        `Registration successful!\n\nYour Student ID is:\n${result.student.id}\n\nPlease save this ID for login.`,
        [{ text: 'OK', onPress: () => {
          setIsRegistering(false);
          setCredentials({ username: result.student.id, password: '' });
        }}]
      );
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const fillDemoCredentials = () => {
    switch (selectedRole) {
      case 'student':
        setCredentials({ username: 'STU-2024-001', password: 'password123' });
        break;
      case 'staff':
        setCredentials({ username: 'ana.garcia@university.edu', password: 'staff123' });
        break;
      case 'admin':
        setCredentials({ username: 'admin@university.edu', password: 'admin123' });
        break;
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setIsRegistering(false);
    setCredentials({ username: '', password: '' });
  };

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="document-text" size={50} color="#4CAF50" />
              <Text style={styles.title}>Clearance System</Text>
            </View>
            <Text style={styles.tagline}>Digital clearance processing - Fast & Easy</Text>
          </View>

          {/* Role Cards */}
          <Text style={styles.sectionTitle}>Select Your Role</Text>
          <View style={styles.roleCards}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, { borderColor: role.color }]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.roleIconContainer, { backgroundColor: role.color + '20' }]}>
                  <Ionicons name={role.icon} size={40} color={role.color} />
                </View>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
                <View style={[styles.roleButton, { backgroundColor: role.color }]}>
                  <Text style={styles.roleButtonText}>Login as {role.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Features */}
          <View style={styles.features}>
            <Text style={styles.featuresTitle}>Why Go Digital?</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Ionicons name="flash" size={24} color="#FFD700" />
                <Text style={styles.featureText}>Fast Processing</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="phone-portrait" size={24} color="#00CED1" />
                <Text style={styles.featureText}>Track Anywhere</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="notifications" size={24} color="#FF6B6B" />
                <Text style={styles.featureText}>Real-time Updates</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="leaf" size={24} color="#4CAF50" />
                <Text style={styles.featureText}>Paperless</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Login/Register Screen
  const currentRole = roles.find(r => r.id === selectedRole);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.loginScrollContent}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#a0aec0" />
            <Text style={styles.backText}>Back to Role Selection</Text>
          </TouchableOpacity>

          {/* Login Card */}
          <View style={[styles.loginCard, { borderTopColor: currentRole.color }]}>
            <View style={styles.loginHeader}>
              <Ionicons name={currentRole.icon} size={50} color={currentRole.color} />
              <Text style={styles.loginTitle}>
                {isRegistering ? 'Student Registration' : `${currentRole.title} Login`}
              </Text>
            </View>

            {!isRegistering ? (
              // Login Form
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {selectedRole === 'student' ? 'Student ID' : 'Email'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={selectedRole === 'student' ? 'e.g., STU-2024-001' : 'Enter your email'}
                    placeholderTextColor="#6b7280"
                    value={credentials.username}
                    onChangeText={(text) => setCredentials({ ...credentials, username: text })}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#6b7280"
                    value={credentials.password}
                    onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, { backgroundColor: currentRole.color }]}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoButton, { borderColor: currentRole.color }]}
                  onPress={fillDemoCredentials}
                >
                  <Text style={[styles.demoButtonText, { color: currentRole.color }]}>
                    Use Demo Credentials
                  </Text>
                </TouchableOpacity>

                {selectedRole === 'student' && (
                  <TouchableOpacity onPress={() => setIsRegistering(true)}>
                    <Text style={styles.registerLink}>New Student? Register Here</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              // Registration Form
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#6b7280"
                    value={registerData.name}
                    onChangeText={(text) => setRegisterData({ ...registerData, name: text })}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#6b7280"
                    value={registerData.email}
                    onChangeText={(text) => setRegisterData({ ...registerData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Course</Text>
                  <TouchableOpacity
                    style={styles.picker}
                    onPress={() => setShowCoursePicker(!showCoursePicker)}
                  >
                    <Text style={styles.pickerText}>{registerData.course}</Text>
                    <Ionicons name="chevron-down" size={20} color="#a0aec0" />
                  </TouchableOpacity>
                  {showCoursePicker && (
                    <View style={styles.pickerOptions}>
                      {courses.map((course) => (
                        <TouchableOpacity
                          key={course}
                          style={styles.pickerOption}
                          onPress={() => {
                            setRegisterData({ ...registerData, course });
                            setShowCoursePicker(false);
                          }}
                        >
                          <Text style={styles.pickerOptionText}>{course}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Year Level</Text>
                  <TouchableOpacity
                    style={styles.picker}
                    onPress={() => setShowYearPicker(!showYearPicker)}
                  >
                    <Text style={styles.pickerText}>{registerData.yearLevel}</Text>
                    <Ionicons name="chevron-down" size={20} color="#a0aec0" />
                  </TouchableOpacity>
                  {showYearPicker && (
                    <View style={styles.pickerOptions}>
                      {yearLevels.map((year) => (
                        <TouchableOpacity
                          key={year}
                          style={styles.pickerOption}
                          onPress={() => {
                            setRegisterData({ ...registerData, yearLevel: year });
                            setShowYearPicker(false);
                          }}
                        >
                          <Text style={styles.pickerOptionText}>{year}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password (min. 6 characters)"
                    placeholderTextColor="#6b7280"
                    value={registerData.password}
                    onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#6b7280"
                    value={registerData.confirmPassword}
                    onChangeText={(text) => setRegisterData({ ...registerData, confirmPassword: text })}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, { backgroundColor: '#4CAF50' }]}
                  onPress={handleRegister}
                >
                  <Text style={styles.loginButtonText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsRegistering(false)}>
                  <Text style={styles.registerLink}>Already have an account? Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  keyboardView: {
    flex: 1,
  },
  loginScrollContent: {
    padding: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#a0aec0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleCards: {
    gap: 15,
  },
  roleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  roleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  roleDescription: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 15,
  },
  roleButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  roleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    marginTop: 40,
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  featureItem: {
    alignItems: 'center',
    width: 80,
  },
  featureText: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 5,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    color: '#a0aec0',
    marginLeft: 8,
    fontSize: 16,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 25,
    borderTopWidth: 4,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    marginBottom: 5,
  },
  label: {
    color: '#a0aec0',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 14,
    color: '#ffffff',
    fontSize: 16,
  },
  picker: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    color: '#ffffff',
    fontSize: 16,
  },
  pickerOptions: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerOptionText: {
    color: '#ffffff',
    fontSize: 14,
  },
  loginButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  demoButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  registerLink: {
    color: '#a0aec0',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
