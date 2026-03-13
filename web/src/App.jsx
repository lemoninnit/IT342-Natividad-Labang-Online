import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Landing from './pages/landing/Landing'

function App() {
  const path = window.location.pathname

  if (path === '/login') return <Login />
  if (path === '/register') return <Register />
  if (path === '/dashboard') return <Dashboard />
  return <Landing />
}

export default App