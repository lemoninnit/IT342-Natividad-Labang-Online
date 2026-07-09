import { useState, useEffect } from 'react'
import { adminAPI, prefetchUserData } from '../../lib/api'
import AdminLayout from './AdminLayout'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [residents, setResidents] = useState(() => {
    const cached = localStorage.getItem('cached_admin_users')
    return cached ? JSON.parse(cached) : []
  })
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem('cached_admin_users')
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const sessionData = sessionStorage.getItem('serviline_session')
    if (!sessionData) {
      window.location.href = '/admin/login'
      return
    }

    try {
      const session = JSON.parse(sessionData)
      if (!session?.role || session.role.toUpperCase() !== 'ADMIN') {
        window.location.href = '/dashboard'
        return
      }
      // Warm up and refresh all admin caches silently in the background
      prefetchUserData(session.userId, true)
    } catch (error) {
      console.error('Session parse error:', error)
      window.location.href = '/admin/login'
      return
    }

    const fetchResidents = async (showLoader = false) => {
      if (showLoader || !localStorage.getItem('cached_admin_users')) {
        setLoading(true)
      }
      try {
        const res = await adminAPI.getAllUsers()
        setResidents(res.data)
        try { localStorage.setItem('cached_admin_users', JSON.stringify(res.data)) } catch (e) { console.warn('Storage quota exceeded') }
      } catch (error) {
        console.error('Failed to fetch residents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResidents(false)
  }, [])

  const handleVerifyResident = async (id) => {
    try {
      await adminAPI.confirmUser(id)
      const res = await adminAPI.getAllUsers()
      setResidents(res.data)
      localStorage.setItem('cached_admin_users', JSON.stringify(res.data))
    } catch (error) {
      console.error('Failed to verify resident:', error)
      alert('Failed to verify resident')
    }
  }

  const getImageUrl = (data) => {
    if (!data) return null
    if (typeof data === 'string') {
      const base64 = data.startsWith('data:') ? data.split(',')[1] : data
      return `data:image/jpeg;base64,${base64}`
    }
    return `data:image/jpeg;base64,${data}`
  }

  const filteredResidents = residents.filter(user => {
    if (user.role === 'ADMIN') return false

    const matchesSearch = searchQuery.trim() === '' || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  return (
    <AdminLayout activeSection="residents" title="Resident Management" subtitle="Review resident profiles and verification documents.">
      <div className="mgmt-container">
        <div className="data-card">
          <div className="card-header">
            <h2 className="card-title">Resident Management</h2>
            <div className="card-actions" style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
              <div className="search-box" style={{ width: '250px' }}>
                <input 
                  type="text" 
                  placeholder="Search residents..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff'
                  }}
                />
              </div>
              <button className="btn-action" style={{background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px'}} onClick={() => {
                setLoading(true)
                adminAPI.getAllUsers().then(res => {
                  setResidents(res.data)
                  localStorage.setItem('cached_admin_users', JSON.stringify(res.data))
                  setLoading(false)
                }).catch(() => setLoading(false))
              }} title="Refresh">↻ Refresh</button>
            </div>
          </div>

          <div className="filter-bar" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginLeft: 'auto' }}>
              <span className="count-badge">{filteredResidents.length} Residents</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Resident Name</th>
                  <th>Contact Details</th>
                  <th>Verification ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.length > 0 ? (
                  filteredResidents.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <span className="user-name">{user.firstName} {user.lastName}</span>
                          <span className="user-id">#{user.id}</span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <span className="info-email">{user.email}</span>
                          <span className="info-phone">{user.phoneNumber || 'No phone'}</span>
                        </div>
                      </td>
                      <td>
                        {user.residentIdImage ? (
                          <button className="btn-action btn-view" onClick={() => setSelectedImage(getImageUrl(user.residentIdImage))}>
                            View Document
                          </button>
                        ) : (
                          <span className="no-data">Not Uploaded</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${user.residentConfirmed ? 'status-paid' : 'status-pending'}`}>
                          {user.residentConfirmed ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        {!user.residentConfirmed && (
                          <button className="btn-action btn-verify" onClick={() => handleVerifyResident(user.id)}>
                            Approve Resident
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No residents found
                    </td>
                  </tr>
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

      {selectedImage && (
        <div className="id-preview-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage} alt="Resident Document" className="preview-image" />
          </div>
        </div>
      )}
    </AdminLayout>
  )
}