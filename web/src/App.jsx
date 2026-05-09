import Register from './features/auth/Register'
import RegisterSuccess from './features/auth/RegisterSuccess'
import Login from './features/auth/Login'
import Logout from './features/auth/Logout'
import Dashboard from './features/dashboard/Dashboard'
import EditProfile from './features/dashboard/EditProfile'
import AdminDashboard from './features/admin/AdminDashboard'
import AdminCertificates from './features/admin/AdminCertificates'
import AdminReports from './features/admin/AdminReports'
import AdminAnnouncements from './features/admin/AdminAnnouncements'
import AdminLogin from './features/admin/AdminLogin'
import Landing from './landing/Landing'

function App() {
  const path = window.location.pathname

  if (path === '/logout') return <Logout />
  if (path === '/login') return <Login />
  if (path === '/register') return <Register />
  if (path === '/register-success') return <RegisterSuccess />
  if (path === '/dashboard') return <Dashboard />
  if (path === '/edit-profile') return <EditProfile />
  if (path === '/admin') return <AdminDashboard />
  if (path === '/admin/residents') return <AdminDashboard />
  if (path === '/admin/certificates') return <AdminCertificates />
  if (path === '/admin/reports') return <AdminReports />
  if (path === '/admin/announcements') return <AdminAnnouncements />
  if (path === '/admin/login') return <AdminLogin />
  return <Landing />
}

export default App