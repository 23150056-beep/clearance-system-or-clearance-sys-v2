import { createContext, useContext, useState } from 'react'

const DataContext = createContext()

// Mock data for the clearance system
const initialStudents = [
  {
    id: 'STU-2024-001',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@university.edu',
    course: 'BS Computer Science',
    yearLevel: '4th Year',
    clearanceStatus: 'in-progress',
    requirements: [
      { id: 1, department: 'Library', description: 'Return all borrowed books', status: 'pending', remarks: '', dueDate: '2026-02-15', submission: null, submittedAt: null },
      { id: 2, department: 'Laboratory', description: 'Clear laboratory equipment', status: 'approved', remarks: 'All equipment returned', dueDate: '2026-02-10', submission: { fileName: 'lab_clearance.jpg', fileType: 'image/jpeg', fileData: null }, submittedAt: '2026-01-25' },
      { id: 3, department: 'Finance', description: 'Settle outstanding balance', status: 'pending', remarks: '', dueDate: '2026-02-20', submission: null, submittedAt: null },
      { id: 4, department: 'Registrar', description: 'Submit graduation requirements', status: 'pending', remarks: '', dueDate: '2026-02-25', submission: null, submittedAt: null },
      { id: 5, department: 'Student Affairs', description: 'Return student ID', status: 'approved', remarks: 'ID returned', dueDate: '2026-02-12', submission: { fileName: 'id_return_receipt.pdf', fileType: 'application/pdf', fileData: null }, submittedAt: '2026-01-20' },
      { id: 6, department: 'Department', description: 'Complete thesis defense', status: 'pending', remarks: '', dueDate: '2026-03-01', submission: null, submittedAt: null },
    ]
  },
  {
    id: 'STU-2024-002',
    name: 'Maria Santos',
    email: 'maria.santos@university.edu',
    course: 'BS Information Technology',
    yearLevel: '4th Year',
    clearanceStatus: 'in-progress',
    requirements: [
      { id: 1, department: 'Library', description: 'Return all borrowed books', status: 'approved', remarks: 'Cleared', dueDate: '2026-02-15', submission: { fileName: 'library_receipt.jpg', fileType: 'image/jpeg', fileData: null }, submittedAt: '2026-01-22' },
      { id: 2, department: 'Laboratory', description: 'Clear laboratory equipment', status: 'submitted', remarks: '', dueDate: '2026-02-10', submission: { fileName: 'lab_form.pdf', fileType: 'application/pdf', fileData: null }, submittedAt: '2026-01-28' },
      { id: 3, department: 'Finance', description: 'Settle outstanding balance', status: 'rejected', remarks: 'Outstanding balance of ₱5,000. Please settle and resubmit receipt.', dueDate: '2026-02-20', submission: { fileName: 'partial_payment.jpg', fileType: 'image/jpeg', fileData: null }, submittedAt: '2026-01-26' },
      { id: 4, department: 'Registrar', description: 'Submit graduation requirements', status: 'submitted', remarks: '', dueDate: '2026-02-25', submission: { fileName: 'grad_docs.pdf', fileType: 'application/pdf', fileData: null }, submittedAt: '2026-01-29' },
      { id: 5, department: 'Student Affairs', description: 'Return student ID', status: 'pending', remarks: '', dueDate: '2026-02-12', submission: null, submittedAt: null },
      { id: 6, department: 'Department', description: 'Complete thesis defense', status: 'approved', remarks: 'Passed with flying colors!', dueDate: '2026-03-01', submission: { fileName: 'thesis_approval.pdf', fileType: 'application/pdf', fileData: null }, submittedAt: '2026-01-15' },
    ]
  },
  {
    id: 'STU-2024-003',
    name: 'Pedro Reyes',
    email: 'pedro.reyes@university.edu',
    course: 'BS Computer Engineering',
    yearLevel: '4th Year',
    clearanceStatus: 'completed',
    requirements: [
      { id: 1, department: 'Library', description: 'Return all borrowed books', status: 'approved', remarks: 'Cleared', dueDate: '2026-02-15', submission: { fileName: 'library_clear.jpg', fileType: 'image/jpeg', fileData: null }, submittedAt: '2026-01-10' },
      { id: 2, department: 'Laboratory', description: 'Clear laboratory equipment', status: 'approved', remarks: 'All clear', dueDate: '2026-02-10', submission: { fileName: 'lab_clear.jpg', fileType: 'image/jpeg', fileData: null }, submittedAt: '2026-01-11' },
      { id: 3, department: 'Finance', description: 'Settle outstanding balance', status: 'approved', remarks: 'Fully paid', dueDate: '2026-02-20', submission: { fileName: 'payment_receipt.pdf', fileType: 'application/pdf', fileData: null }, submittedAt: '2026-01-12' },
      { id: 4, department: 'Registrar', description: 'Submit graduation requirements', status: 'approved', remarks: 'Complete', dueDate: '2026-02-25', submission: { fileName: 'registrar_docs.pdf', fileType: 'application/pdf', fileData: null }, submittedAt: '2026-01-13' },
      { id: 5, department: 'Student Affairs', description: 'Return student ID', status: 'approved', remarks: 'ID returned', dueDate: '2026-02-12', submission: { fileName: 'id_receipt.jpg', fileType: 'image/jpeg', fileData: null }, submittedAt: '2026-01-14' },
      { id: 6, department: 'Department', description: 'Complete thesis defense', status: 'approved', remarks: 'Excellent work!', dueDate: '2026-03-01', submission: { fileName: 'thesis_cert.pdf', fileType: 'application/pdf', fileData: null }, submittedAt: '2026-01-15' },
    ]
  }
]

const initialStaff = [
  { id: 'STAFF-001', name: 'Dr. Ana Garcia', email: 'ana.garcia@university.edu', department: 'Library', role: 'Librarian' },
  { id: 'STAFF-002', name: 'Engr. Mark Lopez', email: 'mark.lopez@university.edu', department: 'Laboratory', role: 'Lab Technician' },
  { id: 'STAFF-003', name: 'Ms. Rose Tan', email: 'rose.tan@university.edu', department: 'Finance', role: 'Accountant' },
  { id: 'STAFF-004', name: 'Mr. John Cruz', email: 'john.cruz@university.edu', department: 'Registrar', role: 'Registrar Staff' },
  { id: 'STAFF-005', name: 'Ms. Lisa Mendoza', email: 'lisa.mendoza@university.edu', department: 'Student Affairs', role: 'Student Affairs Officer' },
  { id: 'STAFF-006', name: 'Dr. Carlos Ramos', email: 'carlos.ramos@university.edu', department: 'Department', role: 'Department Head' },
]

const initialAdmins = [
  { id: 'ADMIN-001', name: 'System Administrator', email: 'admin@university.edu', role: 'Super Admin' },
]

// Demo mode - in production, use proper authentication service
const DEMO_MODE = true
const validateDemoCredentials = (role, username, password) => {
  if (!DEMO_MODE) return false
  // Demo credentials for testing only
  const demoPass = atob('cGFzc3dvcmQxMjM=') // Base64 encoded
  const staffPass = atob('c3RhZmYxMjM=') // Base64 encoded
  const adminPass = atob('YWRtaW4xMjM=') // Base64 encoded
  
  if (role === 'student') return password === demoPass
  if (role === 'staff') return password === staffPass
  if (role === 'admin') return password === adminPass
  return false
}

const departments = ['Library', 'Laboratory', 'Finance', 'Registrar', 'Student Affairs', 'Department']

export function DataProvider({ children }) {
  const [students, setStudents] = useState(initialStudents)
  const [staff, setStaff] = useState(initialStaff)
  const [admins, setAdmins] = useState(initialAdmins)
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)

  // Generate new student ID
  const generateStudentId = () => {
    const year = new Date().getFullYear()
    const existingIds = students.map(s => {
      const parts = s.id.split('-')
      return parseInt(parts[2]) || 0
    })
    const maxId = Math.max(...existingIds, 0)
    const newId = String(maxId + 1).padStart(3, '0')
    return `STU-${year}-${newId}`
  }

  // Generate new staff ID
  const generateStaffId = () => {
    const existingIds = staff.map(s => {
      const parts = s.id.split('-')
      return parseInt(parts[1]) || 0
    })
    const maxId = Math.max(...existingIds, 0)
    const newId = String(maxId + 1).padStart(3, '0')
    return `STAFF-${newId}`
  }

  // ======================
  // CRUD OPERATIONS
  // ======================

  // CREATE - Register new student
  const registerStudent = (studentData) => {
    // Check if email already exists
    if (students.find(s => s.email === studentData.email)) {
      return { success: false, message: 'Email already registered' }
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
        submittedAt: null
      }))
    }

    setStudents(prev => [...prev, newStudent])
    return { success: true, student: newStudent, message: 'Registration successful! You can now login.' }
  }

  // CREATE - Add new staff (admin only)
  const addStaff = (staffData) => {
    if (staff.find(s => s.email === staffData.email)) {
      return { success: false, message: 'Email already registered' }
    }

    const newStaff = {
      id: generateStaffId(),
      name: staffData.name,
      email: staffData.email,
      password: staffData.password,
      department: staffData.department,
      role: staffData.role
    }

    setStaff(prev => [...prev, newStaff])
    return { success: true, staff: newStaff, message: 'Staff added successfully!' }
  }

  // READ - Get student by ID
  const getStudentById = (studentId) => {
    return students.find(s => s.id === studentId) || null
  }

  // READ - Get staff by ID
  const getStaffById = (staffId) => {
    return staff.find(s => s.id === staffId) || null
  }

  // READ - Get all students
  const getAllStudents = () => students

  // READ - Get all staff
  const getAllStaff = () => staff

  // UPDATE - Update student profile
  const updateStudent = (studentId, updates) => {
    const studentExists = students.find(s => s.id === studentId)
    if (!studentExists) {
      return { success: false, message: 'Student not found' }
    }

    // Check email uniqueness if changing email
    if (updates.email && updates.email !== studentExists.email) {
      if (students.find(s => s.email === updates.email)) {
        return { success: false, message: 'Email already in use' }
      }
    }

    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return { ...student, ...updates }
      }
      return student
    }))

    // Update currentUser if it's the same student
    if (currentUser?.id === studentId) {
      setCurrentUser(prev => ({ ...prev, ...updates }))
    }

    return { success: true, message: 'Profile updated successfully' }
  }

  // UPDATE - Update staff profile
  const updateStaff = (staffId, updates) => {
    const staffExists = staff.find(s => s.id === staffId)
    if (!staffExists) {
      return { success: false, message: 'Staff not found' }
    }

    if (updates.email && updates.email !== staffExists.email) {
      if (staff.find(s => s.email === updates.email)) {
        return { success: false, message: 'Email already in use' }
      }
    }

    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        return { ...s, ...updates }
      }
      return s
    }))

    if (currentUser?.id === staffId) {
      setCurrentUser(prev => ({ ...prev, ...updates }))
    }

    return { success: true, message: 'Staff profile updated successfully' }
  }

  // DELETE - Remove student
  const deleteStudent = (studentId) => {
    const studentExists = students.find(s => s.id === studentId)
    if (!studentExists) {
      return { success: false, message: 'Student not found' }
    }

    setStudents(prev => prev.filter(s => s.id !== studentId))
    
    // Logout if deleting current user
    if (currentUser?.id === studentId) {
      logout()
    }

    return { success: true, message: 'Student removed successfully' }
  }

  // DELETE - Remove staff
  const deleteStaff = (staffId) => {
    const staffExists = staff.find(s => s.id === staffId)
    if (!staffExists) {
      return { success: false, message: 'Staff not found' }
    }

    setStaff(prev => prev.filter(s => s.id !== staffId))

    if (currentUser?.id === staffId) {
      logout()
    }

    return { success: true, message: 'Staff removed successfully' }
  }

  // Helper function for default requirement descriptions
  const getDefaultRequirementDescription = (dept) => {
    const descriptions = {
      'Library': 'Return all borrowed books and clear any fines',
      'Laboratory': 'Clear laboratory equipment and settle any damages',
      'Finance': 'Settle all outstanding balance and fees',
      'Registrar': 'Submit all required graduation documents',
      'Student Affairs': 'Return student ID and settle any obligations',
      'Department': 'Complete all academic requirements and thesis/capstone'
    }
    return descriptions[dept] || 'Complete department requirements'
  }

  // Helper function for default due date (30 days from now)
  const getDefaultDueDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toISOString().split('T')[0]
  }

  // Authentication
  const login = (role, credentials) => {
    let user = null
    
    if (role === 'student') {
      user = students.find(s => s.id === credentials.username)
      if (user && !validateDemoCredentials(role, credentials.username, credentials.password)) user = null
    } else if (role === 'staff') {
      user = staff.find(s => s.email === credentials.username)
      if (user && !validateDemoCredentials(role, credentials.username, credentials.password)) user = null
    } else if (role === 'admin') {
      user = admins.find(a => a.email === credentials.username)
      if (user && !validateDemoCredentials(role, credentials.username, credentials.password)) user = null
    }

    if (user) {
      setCurrentUser(user)
      setUserRole(role)
      return { success: true, user }
    }
    return { success: false, message: 'Invalid credentials' }
  }

  const logout = () => {
    setCurrentUser(null)
    setUserRole(null)
  }

  // Submit requirement (for students) - upload file
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
                fileData: file.dataUrl,
                fileSize: file.size
              },
              submittedAt: new Date().toISOString().split('T')[0],
              remarks: ''
            }
          }
          return req
        })
        
        return { ...student, requirements: updatedRequirements }
      }
      return student
    }))
    
    // Update currentUser if it's the same student
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
                fileData: file.dataUrl,
                fileSize: file.size
              },
              submittedAt: new Date().toISOString().split('T')[0],
              remarks: ''
            }
          }
          return req
        })
        return { ...prev, requirements: updatedRequirements }
      })
    }
  }

  // Update requirement status (for staff)
  const updateRequirementStatus = (studentId, requirementId, status, remarks) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedRequirements = student.requirements.map(req => {
          if (req.id === requirementId) {
            return { ...req, status, remarks }
          }
          return req
        })
        
        // Check if all requirements are approved
        const allApproved = updatedRequirements.every(req => req.status === 'approved')
        
        return {
          ...student,
          requirements: updatedRequirements,
          clearanceStatus: allApproved ? 'completed' : 'in-progress'
        }
      }
      return student
    }))
  }

  // Get students for a specific department (for staff view)
  const getStudentsByDepartment = (department) => {
    return students.map(student => ({
      ...student,
      departmentRequirement: student.requirements.find(r => r.department === department)
    })).filter(s => s.departmentRequirement)
  }

  // Get clearance statistics
  const getStatistics = () => {
    const totalStudents = students.length
    const completedClearances = students.filter(s => s.clearanceStatus === 'completed').length
    const pendingClearances = students.filter(s => s.clearanceStatus === 'in-progress').length
    
    const departmentStats = departments.map(dept => {
      const approved = students.filter(s => 
        s.requirements.find(r => r.department === dept && r.status === 'approved')
      ).length
      const pending = students.filter(s => 
        s.requirements.find(r => r.department === dept && (r.status === 'pending' || r.status === 'submitted'))
      ).length
      const rejected = students.filter(s => 
        s.requirements.find(r => r.department === dept && r.status === 'rejected')
      ).length
      
      return { department: dept, approved, pending, rejected }
    })

    return {
      totalStudents,
      completedClearances,
      pendingClearances,
      departmentStats
    }
  }

  // Get current student data (refreshed)
  const getCurrentStudent = () => {
    if (userRole === 'student' && currentUser) {
      return students.find(s => s.id === currentUser.id)
    }
    return null
  }

  const value = {
    // State
    students,
    staff,
    admins,
    departments,
    currentUser,
    userRole,
    
    // Auth
    login,
    logout,
    
    // CRUD - Create
    registerStudent,
    addStaff,
    
    // CRUD - Read
    getStudentById,
    getStaffById,
    getAllStudents,
    getAllStaff,
    getCurrentStudent,
    getStudentsByDepartment,
    getStatistics,
    
    // CRUD - Update
    updateStudent,
    updateStaff,
    submitRequirement,
    updateRequirementStatus,
    
    // CRUD - Delete
    deleteStudent,
    deleteStaff
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
