import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import './Navbar.css'

function Navbar() {
  const { currentUser, userRole, logout } = useData()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getRoleIcon = () => {
    switch(userRole) {
      case 'student': return '🎓'
      case 'staff': return '👨‍💼'
      case 'admin': return '🛡️'
      default: return '👤'
    }
  }

  const getRoleColor = () => {
    switch(userRole) {
      case 'student': return '#4CAF50'
      case 'staff': return '#2196F3'
      case 'admin': return '#9C27B0'
      default: return '#666'
    }
  }

  return (
    <nav className="navbar" style={{ '--role-color': getRoleColor() }}>
      <div className="navbar-brand">
        <span className="nav-logo">📋</span>
        <span className="nav-title">Clearance System</span>
      </div>
      
      <div className="navbar-user">
        <div className="user-info">
          <span className="user-icon">{getRoleIcon()}</span>
          <div className="user-details">
            <span className="user-name">{currentUser?.name}</span>
            <span className="user-role">{userRole?.charAt(0).toUpperCase() + userRole?.slice(1)} {currentUser?.department ? `- ${currentUser.department}` : ''}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
