import { useState, useEffect } from 'react'
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
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('replacestate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    // Global click listener to intercept local link navigation
    const handleGlobalClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      // Only intercept local relative paths starting with / (but not external links or hash-only links on the same page)
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        // If it's a hash link on the home page and we are already on the home page, let it behave normally for scroll
        if (href.includes('#') && window.location.pathname === href.split('#')[0]) {
          return;
        }

        e.preventDefault();
        window.history.pushState(null, '', href);
        window.dispatchEvent(new Event('pushstate'));
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('replacestate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    // If there is a hash in the URL, scroll to it smoothly
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Wait a small timeout to let the page render first
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Scroll to top on standard navigation
      window.scrollTo(0, 0);
    }
  }, [path]);

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