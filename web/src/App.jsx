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
      // Only intercept local relative paths starting with / (but not external links, hash-only links, or download links)
      if (href && href.startsWith('/') && !href.startsWith('//') && !anchor.hasAttribute('download')) {
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

  const effectivePath = path === '/logout'
    ? (sessionStorage.getItem("pre_logout_path") || '/dashboard')
    : path;

  let pageContent;
  if (effectivePath === '/login') pageContent = <Login />;
  else if (effectivePath === '/register') pageContent = <Register />;
  else if (effectivePath === '/register-success') pageContent = <RegisterSuccess />;
  else if (effectivePath === '/dashboard') pageContent = <Dashboard />;
  else if (effectivePath === '/edit-profile') pageContent = <EditProfile />;
  else if (effectivePath === '/admin') pageContent = <AdminDashboard />;
  else if (effectivePath === '/admin/residents') pageContent = <AdminDashboard />;
  else if (effectivePath === '/admin/certificates') pageContent = <AdminCertificates />;
  else if (effectivePath === '/admin/reports') pageContent = <AdminReports />;
  else if (effectivePath === '/admin/announcements') pageContent = <AdminAnnouncements />;
  else if (effectivePath === '/admin/login') pageContent = <AdminLogin />;
  else pageContent = <Landing />;

  return (
    <>
      {pageContent}
      {path === '/logout' && <Logout />}
    </>
  );
}

export default App