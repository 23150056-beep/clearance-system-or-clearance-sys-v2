import { useState, useRef, useEffect } from 'react'
import { useData } from '../context/DataContext'
import Navbar from '../components/Navbar'
import './StudentDashboard.css'

function StudentDashboard() {
  const { currentUser, submitRequirement, getCurrentStudent } = useData()
  const [selectedRequirement, setSelectedRequirement] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [viewSubmission, setViewSubmission] = useState(null)
  const fileInputRef = useRef(null)

  // Get fresh student data
  const student = getCurrentStudent() || currentUser

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedRequirement || viewSubmission) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedRequirement, viewSubmission])

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
      case 'submitted': return 'Under Review'
      default: return status
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

  const getRequirementInstructions = (department) => {
    switch(department) {
      case 'Library': return 'Upload a photo of your library clearance slip or receipt showing all books have been returned.'
      case 'Laboratory': return 'Upload the signed laboratory clearance form from your lab instructor.'
      case 'Finance': return 'Upload your official receipt or proof of payment for any outstanding balances.'
      case 'Registrar': return 'Upload scanned copies of your graduation requirements (TOR request, photos, etc.).'
      case 'Student Affairs': return 'Upload a photo of your student ID return receipt or clearance slip.'
      case 'Department': return 'Upload your thesis/capstone approval form or defense result documentation.'
      default: return 'Upload the required document for this clearance.'
    }
  }

  const completedCount = student?.requirements.filter(r => r.status === 'approved').length || 0
  const totalCount = student?.requirements.length || 0
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const pendingTasks = student?.requirements.filter(r => r.status === 'pending') || []
  const submittedTasks = student?.requirements.filter(r => r.status === 'submitted') || []
  const rejectedTasks = student?.requirements.filter(r => r.status === 'rejected') || []
  const approvedTasks = student?.requirements.filter(r => r.status === 'approved') || []

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload an image (JPG, PNG, GIF) or PDF file')
        return
      }

      setUploadFile(file)
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setPreviewUrl(null)
      }
    }
  }

  const handleSubmit = async () => {
    if (!uploadFile || !selectedRequirement) return

    setIsUploading(true)

    // Convert file to base64 for storage (in real app, you'd upload to server)
    const reader = new FileReader()
    reader.onloadend = () => {
      const fileData = {
        name: uploadFile.name,
        type: uploadFile.type,
        size: uploadFile.size,
        dataUrl: reader.result
      }
      
      submitRequirement(student.id, selectedRequirement.id, fileData)
      
      // Reset state
      setIsUploading(false)
      setSelectedRequirement(null)
      setUploadFile(null)
      setPreviewUrl(null)
    }
    reader.readAsDataURL(uploadFile)
  }

  const handleCloseModal = () => {
    setSelectedRequirement(null)
    setUploadFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const canSubmit = (req) => {
    return req.status === 'pending' || req.status === 'rejected'
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome, {student?.name}! 👋</h1>
            <p>Track your clearance progress and submit your requirements below.</p>
          </div>
          <div className="student-info-card">
            <div className="info-row">
              <span className="info-label">Student ID:</span>
              <span className="info-value">{student?.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Course:</span>
              <span className="info-value">{student?.course}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Year Level:</span>
              <span className="info-value">{student?.yearLevel}</span>
            </div>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="progress-section">
          <h2>📊 Clearance Progress</h2>
          <div className="progress-cards">
            <div className="progress-card main-progress">
              <div className="progress-ring">
                <svg viewBox="0 0 100 100">
                  <circle className="progress-bg" cx="50" cy="50" r="40" />
                  <circle 
                    className="progress-fill" 
                    cx="50" cy="50" r="40"
                    style={{ strokeDasharray: `${progressPercent * 2.51} 251` }}
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-number">{completedCount}/{totalCount}</span>
                  <span className="progress-label">Approved</span>
                </div>
              </div>
              <div className="progress-status">
                {progressPercent === 100 ? (
                  <span className="status-complete">🎉 All requirements cleared!</span>
                ) : (
                  <span className="status-ongoing">Keep going! You're {Math.round(progressPercent)}% done</span>
                )}
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card pending">
                <span className="stat-icon">⏳</span>
                <div className="stat-content">
                  <span className="stat-number">{pendingTasks.length}</span>
                  <span className="stat-label">To Submit</span>
                </div>
              </div>
              <div className="stat-card submitted">
                <span className="stat-icon">📤</span>
                <div className="stat-content">
                  <span className="stat-number">{submittedTasks.length}</span>
                  <span className="stat-label">Under Review</span>
                </div>
              </div>
              <div className="stat-card approved">
                <span className="stat-icon">✅</span>
                <div className="stat-content">
                  <span className="stat-number">{approvedTasks.length}</span>
                  <span className="stat-label">Approved</span>
                </div>
              </div>
              <div className="stat-card rejected">
                <span className="stat-icon">❌</span>
                <div className="stat-content">
                  <span className="stat-number">{rejectedTasks.length}</span>
                  <span className="stat-label">Resubmit</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Needed Section */}
        {rejectedTasks.length > 0 && (
          <section className="action-section">
            <h2>⚠️ Action Required - Please Resubmit</h2>
            <div className="action-cards">
              {rejectedTasks.map(req => (
                <div key={req.id} className="action-card">
                  <div className="action-header">
                    <span className="dept-icon">{getDepartmentIcon(req.department)}</span>
                    <span className="dept-name">{req.department}</span>
                  </div>
                  <p className="action-desc">{req.description}</p>
                  <div className="action-remarks">
                    <strong>Staff Remarks:</strong> {req.remarks}
                  </div>
                  <button 
                    className="resubmit-btn"
                    onClick={() => setSelectedRequirement(req)}
                  >
                    📤 Resubmit Document
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Requirements List */}
        <section className="requirements-section">
          <h2>📋 Your Requirements Checklist</h2>
          <div className="requirements-list">
            {student?.requirements.map(req => (
              <div key={req.id} className={`requirement-item ${getStatusClass(req.status)}`}>
                <div className="req-icon">{getDepartmentIcon(req.department)}</div>
                <div className="req-content">
                  <div className="req-header">
                    <h3>{req.department}</h3>
                    <span className={`req-status ${getStatusClass(req.status)}`}>
                      {getStatusIcon(req.status)} {getStatusLabel(req.status)}
                    </span>
                  </div>
                  <p className="req-description">{req.description}</p>
                  <div className="req-footer">
                    <span className="req-due">📅 Due: {new Date(req.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {req.remarks && <span className="req-remarks">💬 {req.remarks}</span>}
                  </div>
                  
                  {/* Submission Info */}
                  {req.submission && (
                    <div className="submission-info">
                      <span className="submission-label">📎 Submitted:</span>
                      <span className="submission-file" onClick={() => setViewSubmission(req)}>
                        {req.submission.fileName}
                      </span>
                      <span className="submission-date">on {req.submittedAt}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Button */}
                <div className="req-action">
                  {canSubmit(req) && (
                    <button 
                      className="submit-btn"
                      onClick={() => setSelectedRequirement(req)}
                    >
                      {req.status === 'rejected' ? '🔄 Resubmit' : '📤 Submit'}
                    </button>
                  )}
                  {req.status === 'submitted' && (
                    <span className="waiting-badge">⏳ Waiting for review</span>
                  )}
                  {req.status === 'approved' && (
                    <span className="approved-badge">✅ Cleared</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upload Modal */}
        {selectedRequirement && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Submit Requirement</h2>
                <button className="close-btn" onClick={handleCloseModal}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="requirement-info">
                  <span className="req-dept-icon">{getDepartmentIcon(selectedRequirement.department)}</span>
                  <div>
                    <h3>{selectedRequirement.department}</h3>
                    <p>{selectedRequirement.description}</p>
                  </div>
                </div>

                <div className="upload-instructions">
                  <h4>📋 What to Upload:</h4>
                  <p>{getRequirementInstructions(selectedRequirement.department)}</p>
                </div>

                {selectedRequirement.status === 'rejected' && selectedRequirement.remarks && (
                  <div className="rejection-notice">
                    <h4>⚠️ Previous Submission Rejected:</h4>
                    <p>{selectedRequirement.remarks}</p>
                  </div>
                )}

                <div className="upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf"
                    id="file-upload"
                    hidden
                  />
                  
                  {!uploadFile ? (
                    <label htmlFor="file-upload" className="upload-dropzone">
                      <span className="upload-icon">📁</span>
                      <span className="upload-text">Click to select a file</span>
                      <span className="upload-hint">JPG, PNG, GIF or PDF (max 5MB)</span>
                    </label>
                  ) : (
                    <div className="file-preview">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="preview-image" />
                      ) : (
                        <div className="pdf-preview">
                          <span className="pdf-icon">📄</span>
                          <span>PDF Document</span>
                        </div>
                      )}
                      <div className="file-info">
                        <span className="file-name">{uploadFile.name}</span>
                        <span className="file-size">({(uploadFile.size / 1024).toFixed(1)} KB)</span>
                        <button 
                          className="remove-file" 
                          onClick={() => {
                            setUploadFile(null)
                            setPreviewUrl(null)
                            if (fileInputRef.current) fileInputRef.current.value = ''
                          }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button 
                  className="submit-upload-btn" 
                  onClick={handleSubmit}
                  disabled={!uploadFile || isUploading}
                >
                  {isUploading ? '⏳ Uploading...' : '📤 Submit for Review'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Submission Modal */}
        {viewSubmission && viewSubmission.submission && (
          <div className="modal-overlay" onClick={() => setViewSubmission(null)}>
            <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Submitted Document</h2>
                <button className="close-btn" onClick={() => setViewSubmission(null)}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="view-file-info">
                  <span className="file-icon">📎</span>
                  <div>
                    <span className="file-name">{viewSubmission.submission.fileName}</span>
                    <span className="file-meta">
                      Submitted on {viewSubmission.submittedAt} • {viewSubmission.department}
                    </span>
                  </div>
                </div>
                
                {viewSubmission.submission.fileData && viewSubmission.submission.fileType?.startsWith('image/') ? (
                  <div className="view-image-container">
                    <img src={viewSubmission.submission.fileData} alt="Submitted document" />
                  </div>
                ) : (
                  <div className="view-pdf-placeholder">
                    <span className="pdf-big-icon">📄</span>
                    <p>PDF Document</p>
                    <span className="pdf-name">{viewSubmission.submission.fileName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentDashboard
