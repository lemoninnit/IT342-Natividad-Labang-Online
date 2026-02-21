import Register from './pages/auth/Register'
import Login from './pages/auth/Login'  

function App() {
  const path = window.location.pathname

  if (path === '/login') return <Login />
  return <Register />
}

export default App