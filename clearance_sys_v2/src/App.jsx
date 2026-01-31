import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useData } from './context/DataContext'
import LandingPage from './pages/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import StaffDashboard from './pages/StaffDashboard'
import AdminDashboard from './pages/AdminDashboard'

// Protected Route Component
function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, userRole } = useData()
  
  if (!currentUser) {
    return <Navigate to="/" replace />
  }
  
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
