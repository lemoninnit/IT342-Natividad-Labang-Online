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
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="sidebar-logo">
            <img src="/logo.png" alt="Logo" style={{width: '32px', height: '32px', marginRight: '12px'}} />
            ServiLine <span className="admin-tag">Admin</span>
          </div>
        </div>
        <div className="admin-topbar-right">
          <button className="btn-logout-red" onClick={() => window.location.href = '/logout'}>LOGOUT</button>
        </div>
      </div>

      <aside className="admin-sidebar">
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
