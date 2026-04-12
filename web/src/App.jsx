import Register from './pages/auth/Register'
import RegisterSuccess from './pages/auth/RegisterSuccess'
import Login from './pages/auth/Login'
import Logout from './pages/auth/Logout'
import Dashboard from './pages/dashboard/Dashboard'
import EditProfile from './pages/dashboard/EditProfile'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import Landing from './pages/landing/Landing'

function App() {
  const path = window.location.pathname

  if (path === '/logout') return <Logout />
  if (path === '/login') return <Login />
  if (path === '/register') return <Register />
  if (path === '/register-success') return <RegisterSuccess />
  if (path === '/dashboard') return <Dashboard />
  if (path === '/edit-profile') return <EditProfile />
  if (path === '/admin') return <AdminDashboard />
  if (path === '/admin/login') return <AdminLogin />
  return <Landing />
}

export default App