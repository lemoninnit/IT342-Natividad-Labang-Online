import './AdminDashboard.css'

const navItems = [
  { label: 'Residents', icon: '👥', path: '/admin/residents' },
  { label: 'Certificates', icon: '📄', path: '/admin/certificates' },
  { label: 'Reports', icon: '🚨', path: '/admin/reports' },
  { label: 'Announcements', icon: '📢', path: '/admin/announcements' }
]

export default function AdminLayout({ activeSection, title, subtitle, showHeader = true, children }) {
  return (
    <div className="admin-dashboard-wrapper">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            LabangOnline <span className="admin-tag">Admin</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-item ${activeSection === item.label.toLowerCase() ? 'active' : ''}`}
              onClick={() => window.location.href = item.path}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <div style={{ marginTop: 'auto', padding: '16px' }}>
            <button className="nav-item" onClick={() => window.location.href = '/logout'}>
              🚪 Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        {showHeader && (
          <header className="admin-header">
            <h1>{title || activeSection}</h1>
            <p>{subtitle || 'Manage Barangay Labangon services and resident requests'}</p>
          </header>
        )}
        {children}
      </main>
    </div>
  )
}
