import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

// Mock data for the clearance system
const initialStudents = [
  {
    id: 'STU-2024-001',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@university.edu',
    course: 'BS Computer Science',
    yearLevel: '4th Year',
    password: 'password123',
    clearanceStatus: 'in-progress',
    requirements: [
      { id: 1, department: 'Library', description: 'Return all borrowed books', status: 'pending', remarks: '', dueDate: '2026-02-15', submission: null },
      { id: 2, department: 'Laboratory', description: 'Clear laboratory equipment', status: 'approved', remarks: 'All equipment returned', dueDate: '2026-02-10', submission: { fileName: 'lab_clearance.jpg', fileType: 'image' } },
      { id: 3, department: 'Finance', description: 'Settle outstanding balance', status: 'pending', remarks: '', dueDate: '2026-02-20', submission: null },
      { id: 4, department: 'Registrar', description: 'Submit graduation requirements', status: 'pending', remarks: '', dueDate: '2026-02-25', submission: null },
      { id: 5, department: 'Student Affairs', description: 'Return student ID', status: 'approved', remarks: 'ID returned', dueDate: '2026-02-12', submission: { fileName: 'id_return.jpg', fileType: 'image' } },
      { id: 6, department: 'Department', description: 'Complete thesis defense', status: 'pending', remarks: '', dueDate: '2026-03-01', submission: null },
    ]
  },
  {
    id: 'STU-2024-002',
    name: 'Maria Santos',
    email: 'maria.santos@university.edu',
    course: 'BS Information Technology',
    yearLevel: '4th Year',
    password: 'password123',
    clearanceStatus: 'in-progress',
    requirements: [
      { id: 1, department: 'Library', description: 'Return all borrowed books', status: 'approved', remarks: 'Cleared', dueDate: '2026-02-15', submission: { fileName: 'library.jpg', fileType: 'image' } },
      { id: 2, department: 'Laboratory', description: 'Clear laboratory equipment', status: 'submitted', remarks: '', dueDate: '2026-02-10', submission: { fileName: 'lab.jpg', fileType: 'image' } },
      { id: 3, department: 'Finance', description: 'Settle outstanding balance', status: 'rejected', remarks: 'Outstanding balance of ₱5,000', dueDate: '2026-02-20', submission: { fileName: 'payment.jpg', fileType: 'image' } },
      { id: 4, department: 'Registrar', description: 'Submit graduation requirements', status: 'submitted', remarks: '', dueDate: '2026-02-25', submission: { fileName: 'docs.pdf', fileType: 'document' } },
      { id: 5, department: 'Student Affairs', description: 'Return student ID', status: 'pending', remarks: '', dueDate: '2026-02-12', submission: null },
      { id: 6, department: 'Department', description: 'Complete thesis defense', status: 'approved', remarks: 'Excellent!', dueDate: '2026-03-01', submission: { fileName: 'thesis.pdf', fileType: 'document' } },
    ]
  },
];

const initialStaff = [
  { id: 'STAFF-001', name: 'Dr. Ana Garcia', email: 'ana.garcia@university.edu', password: 'staff123', department: 'Library', role: 'Librarian' },
  { id: 'STAFF-002', name: 'Engr. Mark Lopez', email: 'mark.lopez@university.edu', password: 'staff123', department: 'Laboratory', role: 'Lab Technician' },
  { id: 'STAFF-003', name: 'Ms. Rose Tan', email: 'rose.tan@university.edu', password: 'staff123', department: 'Finance', role: 'Accountant' },
  { id: 'STAFF-004', name: 'Mr. John Cruz', email: 'john.cruz@university.edu', password: 'staff123', department: 'Registrar', role: 'Registrar Staff' },
  { id: 'STAFF-005', name: 'Ms. Lisa Mendoza', email: 'lisa.mendoza@university.edu', password: 'staff123', department: 'Student Affairs', role: 'Student Affairs Officer' },
  { id: 'STAFF-006', name: 'Dr. Carlos Ramos', email: 'carlos.ramos@university.edu', password: 'staff123', department: 'Department', role: 'Department Head' },
];

const initialAdmins = [
  { id: 'ADMIN-001', name: 'System Administrator', email: 'admin@university.edu', password: 'admin123', role: 'Super Admin' },
];

const departments = ['Library', 'Laboratory', 'Finance', 'Registrar', 'Student Affairs', 'Department'];

export function DataProvider({ children }) {
  const [students, setStudents] = useState(initialStudents);
  const [staff, setStaff] = useState(initialStaff);
  const [admins, setAdmins] = useState(initialAdmins);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Generate new student ID
  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const existingIds = students.map(s => {
      const parts = s.id.split('-');
      return parseInt(parts[2]) || 0;
    });
    const maxId = Math.max(...existingIds, 0);
    const newId = String(maxId + 1).padStart(3, '0');
    return `STU-${year}-${newId}`;
  };

  // Helper functions
  const getDefaultRequirementDescription = (dept) => {
    const descriptions = {
      'Library': 'Return all borrowed books and clear any fines',
      'Laboratory': 'Clear laboratory equipment and settle any damages',
      'Finance': 'Settle all outstanding balance and fees',
      'Registrar': 'Submit all required graduation documents',
      'Student Affairs': 'Return student ID and settle any obligations',
      'Department': 'Complete all academic requirements and thesis/capstone'
    };
    return descriptions[dept] || 'Complete department requirements';
  };

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  // CREATE - Register new student
  const registerStudent = (studentData) => {
    if (students.find(s => s.email === studentData.email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newStudent = {
      id: generateStudentId(),
      name: studentData.name,
      email: studentData.email,
      course: studentData.course,
      yearLevel: studentData.yearLevel,
      password: studentData.password,
      clearanceStatus: 'in-progress',
      requirements: departments.map((dept, index) => ({
        id: index + 1,
        department: dept,
        description: getDefaultRequirementDescription(dept),
        status: 'pending',
        remarks: '',
        dueDate: getDefaultDueDate(),
        submission: null,
      }))
    };

    setStudents(prev => [...prev, newStudent]);
    return { success: true, student: newStudent, message: 'Registration successful!' };
  };

  // Authentication
  const login = (role, credentials) => {
    let user = null;

    if (role === 'student') {
      user = students.find(s => s.id === credentials.username && s.password === credentials.password);
    } else if (role === 'staff') {
      user = staff.find(s => s.email === credentials.username && s.password === credentials.password);
    } else if (role === 'admin') {
      user = admins.find(a => a.email === credentials.username && a.password === credentials.password);
    }

    if (user) {
      setCurrentUser(user);
      setUserRole(role);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
  };

  // Submit requirement (for students)
  const submitRequirement = (studentId, requirementId, file) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedRequirements = student.requirements.map(req => {
          if (req.id === requirementId) {
            return {
              ...req,
              status: 'submitted',
              submission: {
                fileName: file.name,
                fileType: file.type,
                fileUri: file.uri,
              },
              submittedAt: new Date().toISOString().split('T')[0],
              remarks: ''
            };
          }
          return req;
        });
        return { ...student, requirements: updatedRequirements };
      }
      return student;
    }));

    if (currentUser?.id === studentId) {
      setCurrentUser(prev => {
        const updatedRequirements = prev.requirements.map(req => {
          if (req.id === requirementId) {
            return {
              ...req,
              status: 'submitted',
              submission: {
                fileName: file.name,
                fileType: file.type,
                fileUri: file.uri,
              },
              submittedAt: new Date().toISOString().split('T')[0],
              remarks: ''
            };
          }
          return req;
        });
        return { ...prev, requirements: updatedRequirements };
      });
    }
  };

  // Update requirement status (for staff)
  const updateRequirementStatus = (studentId, requirementId, status, remarks) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedRequirements = student.requirements.map(req => {
          if (req.id === requirementId) {
            return { ...req, status, remarks };
          }
          return req;
        });

        const allApproved = updatedRequirements.every(req => req.status === 'approved');

        return {
          ...student,
          requirements: updatedRequirements,
          clearanceStatus: allApproved ? 'completed' : 'in-progress'
        };
      }
      return student;
    }));
  };

  // Get students for a specific department
  const getStudentsByDepartment = (department) => {
    return students.map(student => ({
      ...student,
      departmentRequirement: student.requirements.find(r => r.department === department)
    })).filter(s => s.departmentRequirement);
  };

  // Get current student data
  const getCurrentStudent = () => {
    if (userRole === 'student' && currentUser) {
      return students.find(s => s.id === currentUser.id);
    }
    return null;
  };

  // Get statistics
  const getStatistics = () => {
    const totalStudents = students.length;
    const completedClearances = students.filter(s => s.clearanceStatus === 'completed').length;
    const pendingClearances = students.filter(s => s.clearanceStatus === 'in-progress').length;

    const departmentStats = departments.map(dept => {
      const approved = students.filter(s =>
        s.requirements.find(r => r.department === dept && r.status === 'approved')
      ).length;
      const pending = students.filter(s =>
        s.requirements.find(r => r.department === dept && (r.status === 'pending' || r.status === 'submitted'))
      ).length;
      const rejected = students.filter(s =>
        s.requirements.find(r => r.department === dept && r.status === 'rejected')
      ).length;

      return { department: dept, approved, pending, rejected };
    });

    return { totalStudents, completedClearances, pendingClearances, departmentStats };
  };

  const value = {
    students,
    staff,
    admins,
    departments,
    currentUser,
    userRole,
    login,
    logout,
    registerStudent,
    submitRequirement,
    updateRequirementStatus,
    getStudentsByDepartment,
    getStatistics,
    getCurrentStudent,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
