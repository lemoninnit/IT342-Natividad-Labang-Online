import { useState, useEffect } from 'react'
import { announcementAPI } from '../../lib/api'
import AdminLayout from './AdminLayout'
import './AdminDashboard.css'
import '../announcement/Announcements.css'

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [formData, setFormData] = useState({
    id: null, title: '', type: 'GENERAL', content: '', postedBy: 'Administrator', priority: 'MEDIUM', expiresAt: '', published: true
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  useEffect(() => {
    let result = announcements
    if (filter !== 'All') result = result.filter(a => a.type === filter.toUpperCase())
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.postedBy?.toLowerCase().includes(q))
    }
    setFilteredAnnouncements(result)
  }, [filter, searchQuery, announcements])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const response = await announcementAPI.getAll()
      setAnnouncements(response.data)
    } catch (err) { console.error('Failed to fetch announcements:', err) }
    finally { setLoading(false) }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const resetForm = () => {
    setFormData({ id: null, title: '', type: 'GENERAL', content: '', postedBy: 'Administrator', priority: 'MEDIUM', expiresAt: '', published: true })
    setIsEditing(false)
    setShowForm(false)
    setPreviewMode(false)
  }

  const handleEdit = (ann) => {
    setFormData({
      id: ann.id, title: ann.title, type: ann.type, content: ann.content,
      postedBy: ann.postedBy || 'Administrator', priority: ann.priority || 'MEDIUM',
      expiresAt: ann.expiresAt ? ann.expiresAt.substring(0, 16) : '',
      published: ann.published !== undefined ? ann.published : true
    })
    setIsEditing(true)
    setShowForm(true)
    setPreviewMode(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!previewMode) { setPreviewMode(true); return }
    try {
      const dataToSubmit = { ...formData }
      if (!dataToSubmit.expiresAt) dataToSubmit.expiresAt = null
      if (isEditing) await announcementAPI.update(formData.id, dataToSubmit)
      else await announcementAPI.create(dataToSubmit)
      resetForm()
      fetchAnnouncements()
    } catch (err) { alert('Error saving announcement.') }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try { await announcementAPI.delete(id); fetchAnnouncements() } catch (err) { console.error(err) }
    }
  }

  return (
    <AdminLayout activeSection="announcements" title="Barangay Announcements" subtitle="Manage and publish community news and events.">
      <div className="mgmt-container">
        {showForm ? (
          <div className="admin-form-section" style={{marginBottom: '32px'}}>
            <div className="form-card">
              <div className="form-card-header">
                <h2>{isEditing ? '📝 Edit Announcement' : '➕ Create New Announcement'}</h2>
                {previewMode && <span className="preview-badge">PREVIEW MODE</span>}
              </div>
              <form onSubmit={handleSubmit}>
                {!previewMode ? (
                  <div className="form-grid">
                    <div className="form-group full-width"><label>Title</label><input name="title" type="text" value={formData.title} onChange={handleInputChange} required/></div>
                    <div className="form-group"><label>Category</label><select name="type" value={formData.type} onChange={handleInputChange}><option value="GENERAL">General</option><option value="EVENTS">Events</option><option value="ALERTS">Alerts</option><option value="MAINTENANCE">Maintenance</option></select></div>
                    <div className="form-group"><label>Priority</label><select name="priority" value={formData.priority} onChange={handleInputChange}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></div>
                    <div className="form-group"><label>Expiration Date</label><input name="expiresAt" type="datetime-local" value={formData.expiresAt} onChange={handleInputChange}/></div>
                    <div className="form-group"><label>Posted By</label><input name="postedBy" type="text" value={formData.postedBy} onChange={handleInputChange} required/></div>
                    <div className="form-group full-width"><label>Content</label><textarea name="content" value={formData.content} onChange={handleInputChange} rows="6" required/></div>
                    <div className="form-group checkbox-group"><label className="checkbox-label"><input name="published" type="checkbox" checked={formData.published} onChange={handleInputChange}/><span>Publish immediately</span></label></div>
                  </div>
                ) : (
                  <div className="preview-container">
                    <div className={`announcement-card preview-card ${formData.type}`}>
                      <div className="card-top"><div className="card-type-tag">{formData.type}</div></div>
                      <h2>{formData.title}</h2>
                      <div className="announcement-content">{formData.content}</div>
                    </div>
                  </div>
                )}
                <div className="form-actions">
                  {previewMode ? (
                    <><button type="button" className="btn-secondary" onClick={() => setPreviewMode(false)}>Back</button><button type="submit" className="btn-primary">{isEditing ? 'Confirm Updates' : 'Publish'}</button></>
                  ) : (
                    <><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button><button type="submit" className="btn-primary">Preview →</button></>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : null}

        <div className="data-card">
          <div className="card-header">
            <h2 className="card-title">Announcements</h2>
            <div className="card-actions" style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
              <div className="search-box" style={{ width: '250px' }}>
                <input type="text" placeholder="Search announcements..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
              </div>
              <button className="btn-verify" style={{padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setShowForm(true)}>+ Add Announcement</button>
              <button className="btn-action" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}} onClick={fetchAnnouncements} title="Refresh">↻ Refresh</button>
            </div>
          </div>

          <div className="filter-bar" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="filter-label">Filter by Type:</div>
            <div className="filter-buttons">
              {['All', 'General', 'Events', 'Alerts', 'Maintenance'].map(f => (
                <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className="count-badge">{filteredAnnouncements.length} Announcements</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.length > 0 ? filteredAnnouncements.map(ann => (
                  <tr key={ann.id}>
                    <td>
                      <div className="user-info">
                        <span className="user-name">{ann.title}</span>
                        <span className="user-id">By {ann.postedBy || 'Admin'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cert-type-info">
                        <span className="cert-type">{ann.type}</span>
                        <span className="cert-date">Priority: {ann.priority || 'MEDIUM'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${ann.published ? 'paid' : 'pending'}`}>
                        {ann.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <span className="date-sub">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="action-buttons">
                      <div className="action-group">
                        <button className="btn-action btn-view" onClick={() => handleEdit(ann)}>Edit</button>
                        <button className="btn-action btn-reject" onClick={() => handleDelete(ann.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="empty-state">No announcements found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="loading-state">
          <div className="loader-themed"></div>
          <div className="loading-text">Loading Data...</div>
        </div>
      )}
    </AdminLayout>
  )
}
