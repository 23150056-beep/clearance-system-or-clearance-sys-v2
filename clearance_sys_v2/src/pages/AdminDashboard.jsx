import { useState } from 'react'
import { useData } from '../context/DataContext'
import Navbar from '../components/Navbar'
import './AdminDashboard.css'

function AdminDashboard() {
  const { students, staff, departments, getStatistics, updateRequirementStatus } = useData()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedStudent, setSelectedStudent] = useState(null)

  const stats = getStatistics()

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return '✅'
      case 'rejected': return '❌'
      case 'pending': return '⏳'
      default: return '📋'
    }
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'approved': return 'status-approved'
      case 'rejected': return 'status-rejected'
      case 'pending': return 'status-pending'
      default: return ''
    }
  }

  const getDepartmentIcon = (department) => {
    switch(department) {
      case 'Library': return '📚'
      case 'Laboratory': return '🔬'
      case 'Finance': return '💰'
      case 'Registrar': return '📝'
      case 'Student Affairs': return '🎓'
      case 'Department': return '🏛️'
      default: return '📋'
    }
  }

  return (
    <div className="dashboard-container admin-dashboard">
      <Navbar />
      
      <main className="dashboard-main">
        {/* Header */}
        <section className="admin-header">
          <h1>🛡️ Admin Dashboard</h1>
          <p>System overview and management</p>
        </section>

        {/* Tab Navigation */}
        <nav className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            🎓 Students
          </button>
          <button 
            className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            👨‍💼 Staff
          </button>
          <button 
            className={`tab-btn ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            🏢 Departments
          </button>
        </nav>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="quick-stat-card">
                <div className="qs-icon">🎓</div>
                <div className="qs-info">
                  <span className="qs-number">{stats.totalStudents}</span>
                  <span className="qs-label">Total Students</span>
                </div>
              </div>
              <div className="quick-stat-card success">
                <div className="qs-icon">✅</div>
                <div className="qs-info">
                  <span className="qs-number">{stats.completedClearances}</span>
                  <span className="qs-label">Completed Clearances</span>
                </div>
              </div>
              <div className="quick-stat-card warning">
                <div className="qs-icon">⏳</div>
                <div className="qs-info">
                  <span className="qs-number">{stats.pendingClearances}</span>
                  <span className="qs-label">In Progress</span>
                </div>
              </div>
              <div className="quick-stat-card info">
                <div className="qs-icon">👨‍💼</div>
                <div className="qs-info">
                  <span className="qs-number">{staff.length}</span>
                  <span className="qs-label">Staff Members</span>
                </div>
              </div>
            </div>

            {/* Department Stats */}
            <div className="dept-stats-section">
              <h2>📊 Department Statistics</h2>
              <div className="dept-stats-grid">
                {stats.departmentStats.map(dept => (
                  <div key={dept.department} className="dept-stat-card">
                    <div className="dept-header">
                      <span className="dept-icon">{getDepartmentIcon(dept.department)}</span>
                      <span className="dept-name">{dept.department}</span>
                    </div>
                    <div className="dept-bars">
                      <div className="dept-bar-item">
                        <span className="bar-label">Approved</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill approved" 
                            style={{ width: `${(dept.approved / stats.totalStudents) * 100}%` }}
                          />
                        </div>
                        <span className="bar-value">{dept.approved}</span>
                      </div>
                      <div className="dept-bar-item">
                        <span className="bar-label">Pending</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill pending" 
                            style={{ width: `${(dept.pending / stats.totalStudents) * 100}%` }}
                          />
                        </div>
                        <span className="bar-value">{dept.pending}</span>
                      </div>
                      <div className="dept-bar-item">
                        <span className="bar-label">Rejected</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill rejected" 
                            style={{ width: `${(dept.rejected / stats.totalStudents) * 100}%` }}
                          />
                        </div>
                        <span className="bar-value">{dept.rejected}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h2>🔔 Recent Clearance Updates</h2>
              <div className="activity-list">
                {students.slice(0, 3).map(student => {
                  const latestUpdate = student.requirements.find(r => r.status !== 'pending')
                  return latestUpdate && (
                    <div key={student.id} className="activity-item">
                      <span className="activity-icon">{getStatusIcon(latestUpdate.status)}</span>
                      <div className="activity-content">
                        <span className="activity-text">
                          <strong>{student.name}</strong> - {latestUpdate.department} clearance was <span className={getStatusClass(latestUpdate.status)}>{latestUpdate.status}</span>
                        </span>
                        <span className="activity-time">Recently</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>All Students</h2>
              <span className="count-badge">{students.length} students</span>
            </div>
            
            <div className="students-grid">
              {students.map(student => {
                const approved = student.requirements.filter(r => r.status === 'approved').length
                const total = student.requirements.length
                const percent = Math.round((approved / total) * 100)
                
                return (
                  <div 
                    key={student.id} 
                    className="student-card"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="sc-header">
                      <span className="sc-avatar">👤</span>
                      <div className="sc-info">
                        <h3>{student.name}</h3>
                        <span className="sc-id">{student.id}</span>
                      </div>
                      <span className={`sc-status ${student.clearanceStatus === 'completed' ? 'complete' : 'ongoing'}`}>
                        {student.clearanceStatus === 'completed' ? '✅ Complete' : '⏳ In Progress'}
                      </span>
                    </div>
                    <div className="sc-details">
                      <span>{student.course}</span>
                      <span>{student.yearLevel}</span>
                    </div>
                    <div className="sc-progress">
                      <div className="sc-progress-bar">
                        <div className="sc-progress-fill" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="sc-progress-text">{approved}/{total} cleared ({percent}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Staff Members</h2>
              <span className="count-badge">{staff.length} staff</span>
            </div>
            
            <div className="staff-grid">
              {staff.map(member => (
                <div key={member.id} className="staff-card">
                  <div className="stf-avatar">{getDepartmentIcon(member.department)}</div>
                  <div className="stf-info">
                    <h3>{member.name}</h3>
                    <span className="stf-role">{member.role}</span>
                    <span className="stf-dept">{member.department}</span>
                  </div>
                  <div className="stf-contact">
                    <span>📧 {member.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Departments Overview</h2>
              <span className="count-badge">{departments.length} departments</span>
            </div>
            
            <div className="departments-grid">
              {departments.map(dept => {
                const deptStaff = staff.filter(s => s.department === dept)
                const deptStats = stats.departmentStats.find(d => d.department === dept)
                
                return (
                  <div key={dept} className="department-card">
                    <div className="dc-header">
                      <span className="dc-icon">{getDepartmentIcon(dept)}</span>
                      <h3>{dept}</h3>
                    </div>
                    <div className="dc-stats">
                      <div className="dc-stat">
                        <span className="dc-stat-num">{deptStaff.length}</span>
                        <span className="dc-stat-label">Staff</span>
                      </div>
                      <div className="dc-stat approved">
                        <span className="dc-stat-num">{deptStats?.approved || 0}</span>
                        <span className="dc-stat-label">Approved</span>
                      </div>
                      <div className="dc-stat pending">
                        <span className="dc-stat-num">{deptStats?.pending || 0}</span>
                        <span className="dc-stat-label">Pending</span>
                      </div>
                      <div className="dc-stat rejected">
                        <span className="dc-stat-num">{deptStats?.rejected || 0}</span>
                        <span className="dc-stat-label">Rejected</span>
                      </div>
                    </div>
                    <div className="dc-staff-list">
                      <span className="dc-staff-title">Assigned Staff:</span>
                      {deptStaff.map(s => (
                        <span key={s.id} className="dc-staff-name">{s.name}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Student Clearance Details</h2>
                <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="student-detail-header">
                  <div className="sdh-avatar">👤</div>
                  <div className="sdh-info">
                    <h3>{selectedStudent.name}</h3>
                    <p>{selectedStudent.id} • {selectedStudent.course}</p>
                    <p>{selectedStudent.yearLevel} • {selectedStudent.email}</p>
                  </div>
                  <span className={`sdh-status ${selectedStudent.clearanceStatus === 'completed' ? 'complete' : 'ongoing'}`}>
                    {selectedStudent.clearanceStatus === 'completed' ? '✅ Clearance Complete' : '⏳ In Progress'}
                  </span>
                </div>

                <div className="requirements-detail-list">
                  <h4>Requirements Status</h4>
                  {selectedStudent.requirements.map(req => (
                    <div key={req.id} className={`req-detail-item ${getStatusClass(req.status)}`}>
                      <span className="rdi-icon">{getDepartmentIcon(req.department)}</span>
                      <div className="rdi-content">
                        <span className="rdi-dept">{req.department}</span>
                        <span className="rdi-desc">{req.description}</span>
                        {req.remarks && <span className="rdi-remarks">"{req.remarks}"</span>}
                      </div>
                      <span className={`rdi-status ${getStatusClass(req.status)}`}>
                        {getStatusIcon(req.status)} {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
