import { useState, useEffect } from 'react';
import Icon from './Icons';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Dispatch a custom event to sync with other ThemeToggle components on the page
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail !== theme) {
        setTheme(e.detail);
      }
    };
    window.addEventListener('theme-changed', handleSync);
    return () => window.removeEventListener('theme-changed', handleSync);
  }, [theme]);

  const toggle = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <button 
      onClick={toggle}
      className="btn-theme-toggle"
      aria-label="Toggle Theme"
      style={{
        background: 'rgba(16, 185, 129, 0.06)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '100px',
        width: '38px',
        height: '38px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#10b981',
        transition: 'all 0.25s ease',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} noBg={true} />
    </button>
  );
}
