import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import './LandingPage.css'

function LandingPage() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    course: '',
    yearLevel: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, registerStudent } = useData()
  const navigate = useNavigate()

  const courses = [
    'BS Computer Science',
    'BS Information Technology',
    'BS Computer Engineering',
    'BS Information Systems',
    'BS Data Science',
    'BS Cybersecurity'
  ]

  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year']

  const roles = [
    {
      id: 'student',
      title: 'Student',
      icon: '🎓',
      description: 'Access your clearance status and requirements',
      color: '#4CAF50'
    },
    {
      id: 'staff',
      title: 'Staff',
      icon: '👨‍💼',
      description: 'Manage and approve student clearances',
      color: '#2196F3'
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: '🛡️',
      description: 'System administration and management',
      color: '#9C27B0'
    }
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    
    const result = login(selectedRole, credentials)
    
    if (result.success) {
      // Navigate to appropriate dashboard
      switch(selectedRole) {
        case 'student':
          navigate('/student')
          break
        case 'staff':
          navigate('/staff')
          break
        case 'admin':
          navigate('/admin')
          break
        default:
          break
      }
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  const handleBack = () => {
    setSelectedRole(null)
    setIsRegistering(false)
    setCredentials({ username: '', password: '' })
    setRegisterData({
      name: '',
      email: '',
      course: '',
      yearLevel: '',
      password: '',
      confirmPassword: ''
    })
    setError('')
    setSuccess('')
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!registerData.name || !registerData.email || !registerData.course || 
        !registerData.yearLevel || !registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Register student
    const result = registerStudent({
      name: registerData.name,
      email: registerData.email,
      course: registerData.course,
      yearLevel: registerData.yearLevel,
      password: registerData.password
    })

    if (result.success) {
      setSuccess(`Registration successful! Your Student ID is: ${result.student.id}. Please save this ID for login.`)
      setRegisterData({
        name: '',
        email: '',
        course: '',
        yearLevel: '',
        password: '',
        confirmPassword: ''
      })
      // Switch to login after 3 seconds
      setTimeout(() => {
        setIsRegistering(false)
        setSuccess('')
        setCredentials({ username: result.student.id, password: '' })
      }, 5000)
    } else {
      setError(result.message)
    }
  }

  const getPlaceholder = () => {
    if (selectedRole === 'student') return 'Enter your Student ID (e.g., STU-2024-001)'
    return 'Enter your email'
  }

  const getDemoCredentials = () => {
    switch(selectedRole) {
      case 'student':
        return { username: 'STU-2024-001', password: 'password123' }
      case 'staff':
        return { username: 'ana.garcia@university.edu', password: 'staff123' }
      case 'admin':
        return { username: 'admin@university.edu', password: 'admin123' }
      default:
        return {}
    }
  }

  const fillDemoCredentials = () => {
    setCredentials(getDemoCredentials())
  }

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Header */}
        <header className="landing-header">
          <div className="logo-container">
            <div className="logo-icon">📋</div>
            <h1>Clearance System</h1>
          </div>
          <p className="tagline">Digital clearance processing - Fast, Easy, and Efficient</p>
        </header>

        {/* Main Content */}
        {!selectedRole ? (
          // Role Selection
          <main className="role-selection">
            <h2>Select Your Role to Continue</h2>
            <div className="role-cards">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="role-card"
                  style={{ '--accent-color': role.color }}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="role-icon">{role.icon}</div>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                  <button className="select-btn">
                    Login as {role.title}
                  </button>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <section className="features-section">
              <h3>Why Go Digital?</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span className="feature-text">Fast Processing</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span className="feature-text">Track Anywhere</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔔</span>
                  <span className="feature-text">Real-time Updates</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌿</span>
                  <span className="feature-text">Paperless</span>
                </div>
              </div>
            </section>
          </main>
        ) : (
          // Login Form
          <main className="login-section">
            <button className="back-btn" onClick={handleBack}>
              ← Back to Role Selection
            </button>
            <div className="login-card" style={{ '--accent-color': roles.find(r => r.id === selectedRole)?.color }}>
              <div className="login-header">
                <span className="login-icon">
                  {roles.find(r => r.id === selectedRole)?.icon}
                </span>
                <h2>
                  {isRegistering 
                    ? 'Student Registration' 
                    : `${roles.find(r => r.id === selectedRole)?.title} Login`
                  }
                </h2>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              {!isRegistering ? (
                // Login Form
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="username">
                      {selectedRole === 'student' ? 'Student ID' : 'Email'}
                    </label>
                    <input
                      type="text"
                      id="username"
                      placeholder={getPlaceholder()}
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="login-btn">
                    Sign In
                  </button>
                  <button type="button" className="demo-btn" onClick={fillDemoCredentials}>
                    Use Demo Credentials
                  </button>
                  {selectedRole === 'student' && (
                    <button 
                      type="button" 
                      className="register-toggle-btn"
                      onClick={() => { setIsRegistering(true); setError(''); }}
                    >
                      New Student? Register Here
                    </button>
                  )}
                  <a href="#" className="forgot-link">Forgot Password?</a>
                </form>
              ) : (
                // Registration Form
                <form onSubmit={handleRegister} className="register-form">
                  <div className="form-group">
                    <label htmlFor="reg-name">Full Name</label>
                    <input
                      type="text"
                      id="reg-name"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-email">Email Address</label>
                    <input
                      type="email"
                      id="reg-email"
                      placeholder="Enter your university email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reg-course">Course</label>
                      <select
                        id="reg-course"
                        value={registerData.course}
                        onChange={(e) => setRegisterData({ ...registerData, course: e.target.value })}
                        required
                      >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="reg-year">Year Level</label>
                      <select
                        id="reg-year"
                        value={registerData.yearLevel}
                        onChange={(e) => setRegisterData({ ...registerData, yearLevel: e.target.value })}
                        required
                      >
                        <option value="">Select Year</option>
                        {yearLevels.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-password">Password</label>
                    <input
                      type="password"
                      id="reg-password"
                      placeholder="Create a password (min. 6 characters)"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-confirm">Confirm Password</label>
                    <input
                      type="password"
                      id="reg-confirm"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="login-btn register-btn">
                    Create Account
                  </button>
                  <button 
                    type="button" 
                    className="register-toggle-btn"
                    onClick={() => { setIsRegistering(false); setError(''); setSuccess(''); }}
                  >
                    Already have an account? Login
                  </button>
                </form>
              )}
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="landing-footer">
          <p>© 2026 Clearance System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
