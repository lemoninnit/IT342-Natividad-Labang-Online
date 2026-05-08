import { useState, useEffect } from 'react'
import { announcementAPI } from '../lib/api'
import '../styles/Announcements.css'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    type: 'GENERAL',
    content: '',
    postedBy: '',
    priority: 'MEDIUM',
    expiresAt: '',
    published: true
  })

  useEffect(() => {
    const sessionData = sessionStorage.getItem("labangonline_session")
    const path = window.location.pathname
    const is_admin_path = path.startsWith('/admin')

    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        setIsAdmin(session.role === 'ADMIN' || is_admin_path)
        if (session.role === 'ADMIN' || is_admin_path) {
          setFormData(prev => ({ ...prev, postedBy: `${session.firstName} ${session.lastName}` }))
        }
      } catch (e) {
        console.error("Session parse error in Announcements:", e)
        if (is_admin_path) setIsAdmin(true)
      }
    } else if (is_admin_path) {
      setIsAdmin(true)
    }
    fetchAnnouncements()
  }, [])

  useEffect(() => {
    let result = announcements

    // Category filter
    if (filter !== 'All') {
      result = result.filter(a => a.type === filter.toUpperCase())
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.content.toLowerCase().includes(query) ||
        a.postedBy?.toLowerCase().includes(query)
      )
    }

    setFilteredAnnouncements(result)
  }, [filter, searchQuery, announcements])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const response = await announcementAPI.getAll()
      setAnnouncements(response.data)
    } catch (err) {
      console.error('Failed to fetch announcements:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const resetForm = () => {
    const sessionData = sessionStorage.getItem("labangonline_session")
    let postedBy = ''
    if (sessionData) {
      const session = JSON.parse(sessionData)
      postedBy = `${session.firstName} ${session.lastName}`
    }

    setFormData({
      id: null,
      title: '',
      type: 'GENERAL',
      content: '',
      postedBy: postedBy,
      priority: 'MEDIUM',
      expiresAt: '',
      published: true
    })
    setIsEditing(false)
    setShowForm(false)
    setPreviewMode(false)
  }

  const handleEdit = (announcement) => {
    setFormData({
      id: announcement.id,
      title: announcement.title,
      type: announcement.type,
      content: announcement.content,
      postedBy: announcement.postedBy || '',
      priority: announcement.priority || 'MEDIUM',
      expiresAt: announcement.expiresAt ? announcement.expiresAt.substring(0, 16) : '',
      published: announcement.published !== undefined ? announcement.published : true
    })
    setIsEditing(true)
    setShowForm(true)
    setPreviewMode(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!previewMode) {
      setPreviewMode(true)
      return
    }

    try {
      const dataToSubmit = { ...formData }
      if (!dataToSubmit.expiresAt) {
        dataToSubmit.expiresAt = null
      }

      if (isEditing) {
        await announcementAPI.update(formData.id, dataToSubmit)
      } else {
        await announcementAPI.create(dataToSubmit)
      }
      resetForm()
      fetchAnnouncements()
    } catch (err) {
      console.error('Failed to save announcement:', err)
      alert('Error saving announcement. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementAPI.delete(id)
        fetchAnnouncements()
      } catch (err) {
        console.error('Failed to delete announcement:', err)
      }
    }
  }

  const openModal = (announcement) => {
    setSelectedAnnouncement(announcement)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAnnouncement(null)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getPriorityBadge = (priority) => {
    const p = priority?.toLowerCase() || 'medium'
    return <span className={`priority-tag p-${p}`}>{priority}</span>
  }

  const filters = ['All', 'General', 'Events', 'Alerts', 'Maintenance']

  return (
    <div className="announcements-container">
      <div className="announcements-header">
        <div className="header-main">
          <h1>📢 Barangay Announcements</h1>
          <p>Stay updated with the latest news and events from Barangay Labangon</p>
        </div>
        
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search announcements..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isAdmin && !showForm && (
            <button className="btn-create-announce" onClick={() => setShowForm(true)}>
              Add Announcement
            </button>
          )}
        </div>
      </div>

      {isAdmin && showForm && (
        <div className="admin-form-section">
          <div className="form-card">
            <div className="form-card-header">
              <h2>{isEditing ? '📝 Edit Announcement' : '➕ Create New Announcement'}</h2>
              {previewMode && <span className="preview-badge">PREVIEW MODE</span>}
            </div>

            <form onSubmit={handleSubmit}>
              {!previewMode ? (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Announcement Title</label>
                    <input 
                      name="title"
                      type="text" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      placeholder="e.g., Upcoming Community Cleanup Drive"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select name="type" value={formData.type} onChange={handleInputChange}>
                      <option value="GENERAL">General</option>
                      <option value="EVENTS">Events</option>
                      <option value="ALERTS">Alerts</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority Level</label>
                    <select name="priority" value={formData.priority} onChange={handleInputChange}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Expiration Date (Optional)</label>
                    <input 
                      name="expiresAt"
                      type="datetime-local" 
                      value={formData.expiresAt} 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Posted By</label>
                    <input 
                      name="postedBy"
                      type="text" 
                      value={formData.postedBy} 
                      onChange={handleInputChange}
                      placeholder="Name of poster"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Detailed Content</label>
                    <textarea 
                      name="content"
                      value={formData.content} 
                      onChange={handleInputChange}
                      placeholder="Enter detailed announcement information here..."
                      rows="6"
                      required
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input 
                        name="published"
                        type="checkbox" 
                        checked={formData.published} 
                        onChange={handleInputChange}
                      />
                      <span>Publish immediately</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="preview-container">
                  <div className={`announcement-card preview-card ${formData.type}`}>
                    <div className="card-top">
                      <div className="card-type-tag">{formData.type}</div>
                      {getPriorityBadge(formData.priority)}
                    </div>
                    <h2>{formData.title}</h2>
                    <div className="announcement-meta">
                      <div className="meta-item"><span>📅</span> {formatDate(new Date())}</div>
                      <div className="meta-item"><span>👤</span> {formData.postedBy}</div>
                    </div>
                    <div className="announcement-content">
                      {formData.content}
                    </div>
                    {formData.expiresAt && (
                      <div className="expiry-notice">
                        Expires on: {formatDate(formData.expiresAt)} at {formatTime(formData.expiresAt)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="form-actions">
                {previewMode ? (
                  <>
                    <button type="button" className="btn-secondary" onClick={() => setPreviewMode(false)}>
                      ← Back to Edit
                    </button>
                    <button type="submit" className="btn-primary">
                      {isEditing ? 'Confirm Updates' : 'Publish Announcement'}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Preview Announcement →
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="announcement-filters">
        {filters.map(f => (
          <button 
            key={f} 
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="announcements-list">
        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Fetching announcements...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📢</div>
            <p>No announcements found.</p>
            {searchQuery && <p className="sub-text">Try adjusting your search or filters.</p>}
          </div>
        ) : (
          filteredAnnouncements.map(announcement => (
            <div key={announcement.id} className={`announcement-card ${announcement.type} ${!announcement.published ? 'unpublished' : ''}`}>
              <div className="card-top">
                <div className="card-type-tag">{announcement.type}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!announcement.published && <span className="draft-tag">DRAFT</span>}
                  {getPriorityBadge(announcement.priority)}
                </div>
              </div>
              
              <h2>{announcement.title}</h2>
              
              <div className="announcement-meta">
                <div className="meta-item">
                  <span>📅</span> {formatDate(announcement.createdAt)}
                </div>
                <div className="meta-item">
                  <span>⏰</span> {formatTime(announcement.createdAt)}
                </div>
                <div className="meta-item">
                  <span>👤</span> {announcement.postedBy || 'Admin'}
                </div>
              </div>
              
              <div className="announcement-preview">
                {announcement.content}
              </div>
              
              <div className="announcement-footer">
                <div className="footer-left">
                  {announcement.expiresAt && (
                    <span className="expires-tag">
                      Expires: {formatDate(announcement.expiresAt)}
                    </span>
                  )}
                </div>
                <div className="footer-right">
                  {isAdmin && (
                    <>
                      <button className="btn-edit-announce" onClick={() => handleEdit(announcement)}>
                        Edit
                      </button>
                      <button className="btn-delete-announce" onClick={() => handleDelete(announcement.id)}>
                        Delete
                      </button>
                    </>
                  )}
                  <button className="read-more-btn" onClick={() => openModal(announcement)}>
                    Details →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && selectedAnnouncement && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <div className="modal-body">
              <div className="modal-header-tags">
                <div className={`card-type-tag ${selectedAnnouncement.type}`}>
                  {selectedAnnouncement.type}
                </div>
                {getPriorityBadge(selectedAnnouncement.priority)}
              </div>
              
              <h1>{selectedAnnouncement.title}</h1>
              
              <div className="announcement-meta modal-meta">
                <div className="meta-item"><span>📅</span> {formatDate(selectedAnnouncement.createdAt)}</div>
                <div className="meta-item"><span>⏰</span> {formatTime(selectedAnnouncement.createdAt)}</div>
                <div className="meta-item"><span>👤</span> Posted by: {selectedAnnouncement.postedBy || 'Administrator'}</div>
              </div>
              
              <div className="modal-full-content">
                {selectedAnnouncement.content}
              </div>

              {selectedAnnouncement.expiresAt && (
                <div className="modal-expiry-footer">
                  This announcement is scheduled to expire on {formatDate(selectedAnnouncement.expiresAt)} at {formatTime(selectedAnnouncement.expiresAt)}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
