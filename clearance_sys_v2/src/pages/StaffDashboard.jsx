import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import Navbar from '../components/Navbar'
import './StaffDashboard.css'

function StaffDashboard() {
  const { currentUser, getStudentsByDepartment, updateRequirementStatus } = useData()
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [filter, setFilter] = useState('all')

  const students = getStudentsByDepartment(currentUser?.department)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedStudent) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedStudent])

  const filteredStudents = students.filter(student => {
    if (filter === 'all') return true
    if (filter === 'submitted') return student.departmentRequirement?.status === 'submitted'
    return student.departmentRequirement?.status === filter
  })

  const stats = {
    total: students.length,
    pending: students.filter(s => s.departmentRequirement?.status === 'pending').length,
    submitted: students.filter(s => s.departmentRequirement?.status === 'submitted').length,
    approved: students.filter(s => s.departmentRequirement?.status === 'approved').length,
    rejected: students.filter(s => s.departmentRequirement?.status === 'rejected').length,
  }

  const handleAction = (studentId, requirementId, action) => {
    updateRequirementStatus(studentId, requirementId, action, remarks)
    setSelectedStudent(null)
    setRemarks('')
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return '✅'
      case 'rejected': return '❌'
      case 'pending': return '⏳'
      case 'submitted': return '📤'
      default: return '📋'
    }
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'approved': return 'status-approved'
      case 'rejected': return 'status-rejected'
      case 'pending': return 'status-pending'
      case 'submitted': return 'status-submitted'
      default: return ''
    }
  }

  const getStatusLabel = (status) => {
    switch(status) {
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      case 'pending': return 'Not Submitted'
      case 'submitted': return 'Awaiting Review'
      default: return status
    }
  }

  return (
    <div className="dashboard-container staff-dashboard">
      <Navbar />
      
      <main className="dashboard-main">
        {/* Header */}
        <section className="staff-header">
          <div className="header-content">
            <h1>📋 {currentUser?.department} Clearance Management</h1>
            <p>Review student submissions and process clearance requests</p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="stats-section">
          <div className="stats-row">
            <div className={`stat-box total ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              <span className="stat-icon">👥</span>
              <div className="stat-info">
                <span className="stat-num">{stats.total}</span>
                <span className="stat-text">Total Students</span>
              </div>
            </div>
            <div className={`stat-box submitted ${filter === 'submitted' ? 'active' : ''}`} onClick={() => setFilter('submitted')}>
              <span className="stat-icon">📤</span>
              <div className="stat-info">
                <span className="stat-num">{stats.submitted}</span>
                <span className="stat-text">To Review</span>
              </div>
            </div>
            <div className={`stat-box pending ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
              <span className="stat-icon">⏳</span>
              <div className="stat-info">
                <span className="stat-num">{stats.pending}</span>
                <span className="stat-text">Not Submitted</span>
              </div>
            </div>
            <div className={`stat-box approved ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <span className="stat-num">{stats.approved}</span>
                <span className="stat-text">Approved</span>
              </div>
            </div>
            <div className={`stat-box rejected ${filter === 'rejected' ? 'active' : ''}`} onClick={() => setFilter('rejected')}>
              <span className="stat-icon">❌</span>
              <div className="stat-info">
                <span className="stat-num">{stats.rejected}</span>
                <span className="stat-text">Rejected</span>
              </div>
            </div>
          </div>
        </section>

        {/* Alert for submissions to review */}
        {stats.submitted > 0 && (
          <div className="review-alert">
            <span className="alert-icon">🔔</span>
            <span className="alert-text">You have <strong>{stats.submitted} submission(s)</strong> waiting for your review!</span>
            <button className="alert-btn" onClick={() => setFilter('submitted')}>Review Now</button>
          </div>
        )}

        {/* Filter Bar */}
        <section className="filter-section">
          <div className="filter-bar">
            <span className="filter-label">Filter by status:</span>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'submitted' ? 'active' : ''}`}
                onClick={() => setFilter('submitted')}
              >
                📤 To Review ({stats.submitted})
              </button>
              <button 
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Not Submitted
              </button>
              <button 
                className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                onClick={() => setFilter('approved')}
              >
                Approved
              </button>
              <button 
                className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </button>
            </div>
          </div>
        </section>

        {/* Students Table */}
        <section className="students-section">
          <h2>Student Clearance Requests</h2>
          
          {filteredStudents.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No {filter !== 'all' ? filter : ''} clearance requests found</p>
            </div>
          ) : (
            <div className="students-table">
              <div className="table-header">
                <span>Student</span>
                <span>Course</span>
                <span>Submission</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {filteredStudents.map(student => (
                <div key={student.id} className={`table-row ${student.departmentRequirement?.status === 'submitted' ? 'highlight-row' : ''}`}>
                  <div className="student-cell">
                    <span className="student-avatar">👤</span>
                    <div className="student-info">
                      <span className="student-name">{student.name}</span>
                      <span className="student-id">{student.id}</span>
                    </div>
                  </div>
                  <div className="course-cell">
                    <span className="course-name">{student.course}</span>
                    <span className="year-level">{student.yearLevel}</span>
                  </div>
                  <div className="submission-cell">
                    {student.departmentRequirement?.submission ? (
                      <div className="submission-preview">
                        <span className="submission-icon">📎</span>
                        <div className="submission-details">
                          <span className="submission-filename">{student.departmentRequirement.submission.fileName}</span>
                          <span className="submission-date">Submitted: {student.departmentRequirement.submittedAt}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="no-submission">No submission yet</span>
                    )}
                  </div>
                  <div className="status-cell">
                    <span className={`status-badge ${getStatusClass(student.departmentRequirement?.status)}`}>
                      {getStatusIcon(student.departmentRequirement?.status)} {getStatusLabel(student.departmentRequirement?.status)}
                    </span>
                    {student.departmentRequirement?.remarks && (
                      <span className="remarks-preview">"{student.departmentRequirement?.remarks}"</span>
                    )}
                  </div>
                  <div className="actions-cell">
                    {student.departmentRequirement?.status === 'submitted' ? (
                      <button 
                        className="review-btn primary"
                        onClick={() => setSelectedStudent(student)}
                      >
                        📋 Review
                      </button>
                    ) : student.departmentRequirement?.status === 'approved' || student.departmentRequirement?.status === 'rejected' ? (
                      <button 
                        className="update-btn"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View Details
                      </button>
                    ) : (
                      <span className="waiting-text">Waiting for submission</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Review Modal */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => { setSelectedStudent(null); setRemarks(''); }}>
            <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {selectedStudent.departmentRequirement?.status === 'submitted' 
                    ? '📋 Review Submission' 
                    : '📄 Submission Details'}
                </h2>
                <button className="close-btn" onClick={() => { setSelectedStudent(null); setRemarks(''); }}>×</button>
              </div>
              
              <div className="modal-body">
                {/* Student Info */}
                <div className="review-student-info">
                  <div className="review-avatar">👤</div>
                  <div className="review-details">
                    <h3>{selectedStudent.name}</h3>
                    <p>{selectedStudent.id}</p>
                    <p>{selectedStudent.course} - {selectedStudent.yearLevel}</p>
                  </div>
                </div>

                {/* Requirement Info */}
                <div className="review-requirement">
                  <h4>Requirement</h4>
                  <p>{selectedStudent.departmentRequirement?.description}</p>
                  <span className="current-status">
                    Current Status: <span className={getStatusClass(selectedStudent.departmentRequirement?.status)}>
                      {getStatusLabel(selectedStudent.departmentRequirement?.status)}
                    </span>
                  </span>
                </div>

                {/* Submitted Document */}
                {selectedStudent.departmentRequirement?.submission && (
                  <div className="submitted-document">
                    <h4>📎 Submitted Document</h4>
                    <div className="document-viewer">
                      {selectedStudent.departmentRequirement.submission.fileData && 
                       selectedStudent.departmentRequirement.submission.fileType?.startsWith('image/') ? (
                        <div className="image-viewer">
                          <img 
                            src={selectedStudent.departmentRequirement.submission.fileData} 
                            alt="Submitted document" 
                          />
                        </div>
                      ) : (
                        <div className="pdf-viewer">
                          <span className="pdf-icon">📄</span>
                          <span className="pdf-label">PDF Document</span>
                        </div>
                      )}
                      <div className="document-info">
                        <span className="doc-name">{selectedStudent.departmentRequirement.submission.fileName}</span>
                        <span className="doc-date">Submitted on {selectedStudent.departmentRequirement.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Previous Remarks (if rejected) */}
                {selectedStudent.departmentRequirement?.status === 'rejected' && selectedStudent.departmentRequirement?.remarks && (
                  <div className="previous-remarks">
                    <h4>Previous Remarks</h4>
                    <p>{selectedStudent.departmentRequirement.remarks}</p>
                  </div>
                )}

                {/* Remarks Input - only show for submitted status */}
                {selectedStudent.departmentRequirement?.status === 'submitted' && (
                  <div className="remarks-input">
                    <label>Your Remarks / Feedback</label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add remarks for the student (required for rejection, optional for approval)..."
                      rows="3"
                    />
                  </div>
                )}

                {/* Show remarks if already approved/rejected */}
                {(selectedStudent.departmentRequirement?.status === 'approved' || 
                  selectedStudent.departmentRequirement?.status === 'rejected') && 
                  selectedStudent.departmentRequirement?.remarks && (
                  <div className="final-remarks">
                    <h4>Your Remarks</h4>
                    <p>{selectedStudent.departmentRequirement.remarks}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons - only for submitted status */}
              {selectedStudent.departmentRequirement?.status === 'submitted' && (
                <div className="modal-footer">
                  <button 
                    className="action-btn reject"
                    onClick={() => {
                      if (!remarks.trim()) {
                        alert('Please provide remarks explaining why the submission is rejected.')
                        return
                      }
                      handleAction(selectedStudent.id, selectedStudent.departmentRequirement.id, 'rejected')
                    }}
                  >
                    ❌ Reject
                  </button>
                  <button 
                    className="action-btn approve"
                    onClick={() => handleAction(selectedStudent.id, selectedStudent.departmentRequirement.id, 'approved')}
                  >
                    ✅ Approve
                  </button>
                </div>
              )}

              {/* Close button for view mode */}
              {selectedStudent.departmentRequirement?.status !== 'submitted' && (
                <div className="modal-footer">
                  <button 
                    className="action-btn close"
                    onClick={() => { setSelectedStudent(null); setRemarks(''); }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default StaffDashboard
