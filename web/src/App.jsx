import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'

function App() {
  const path = window.location.pathname

  if (path === '/login') return <Login />
  if (path === '/dashboard') return <Dashboard />
  return <Register />
}

export default App