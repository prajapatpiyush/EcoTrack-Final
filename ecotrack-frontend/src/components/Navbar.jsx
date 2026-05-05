import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const PUBLIC_LINKS = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/rewards',      label: 'Rewards' },
  { to: '/blogs',        label: 'Blog' },
  { to: '/campaigns',    label: 'Campaigns' },
  { to: '/events',       label: 'Events' },
  { to: '/about',    label: 'About Us' },
];

const ROLE_DASHBOARD = {
  ADMIN:   '/admin/dashboard',
  COMPANY: '/company/dashboard',
  CITIZEN: '/dashboard',
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [theme,      setTheme]      = useState(localStorage.getItem('ecotrack_theme') || 'light');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ecotrack_theme', theme);
  }, [theme]);

  // Close menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const close = (e) => {
      if (!e.target.closest('[data-navbar]')) setMobileOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [mobileOpen]);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => { logout(); navigate('/'); };

  const dashboardTo = ROLE_DASHBOARD[user?.role] || '/dashboard';

  return (
    <nav
      data-navbar
      style={{
        background: 'var(--eco-surface)',
        borderBottom: '1px solid var(--eco-border)',
        height: 'var(--navbar-h)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--space-6)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
        boxShadow: 'var(--shadow-sm)',
        gap: 'var(--space-4)',
      }}
    >

      {/* ── Logo ── */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, background: 'var(--eco-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>
          🌿
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--eco-primary)' }}>
          EcoTrack
        </span>
      </Link>

      {/* ── Desktop: public nav links (centered) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        flex: 1,
        justifyContent: 'center',
      }}
        className="nav-links-desktop"
      >
        {PUBLIC_LINKS.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${isActive(link.to) ? 'nav-link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* ── Right: theme + auth ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginLeft: 'auto' }}>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          className="btn btn--ghost btn--icon"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ fontSize: 16 }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {isAuthenticated ? (
          <>
            {/* User chip — desktop */}
            <Link
              to={dashboardTo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '5px 12px',
                background: 'var(--eco-bg)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--eco-border)',
                textDecoration: 'none',
              }}
              aria-label={`Go to ${user?.role} dashboard`}
            >
              <div style={{
                width: 26, height: 26,
                background: 'var(--eco-primary)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>
                {user?.username?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--eco-text)', whiteSpace: 'nowrap' }}>{user?.username}</div>
                <div style={{ fontSize: 10, color: 'var(--eco-primary)', fontWeight: 700 }}>{user?.role}</div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn--secondary btn--sm"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{ fontWeight: 500 }}>Login</Link>
            <Link to="/register" className="btn btn--primary btn--sm">Get Started</Link>
          </>
        )}

        {/* ── Hamburger (mobile only) ── */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="btn btn--ghost btn--icon"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          style={{
            display: 'none',
            fontSize: 20,
            // shown via media query below
          }}
          id="hamburger-btn"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--navbar-h)',
          left: 0, right: 0,
          background: 'var(--eco-surface)',
          borderBottom: '1px solid var(--eco-border)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 199,
          padding: 'var(--space-4) var(--space-6) var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}>
          {PUBLIC_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'nav-link--active' : ''}`}
              style={{ padding: '10px 14px', fontSize: 15 }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'var(--eco-border)', margin: '8px 0' }} />
          {isAuthenticated ? (
            <>
              <Link to={dashboardTo} className="btn btn--primary btn--md btn--full">My Dashboard</Link>
              <button onClick={handleLogout} className="btn btn--secondary btn--md btn--full">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn--secondary btn--md btn--full">Login</Link>
              <Link to="/register" className="btn btn--primary   btn--md btn--full">Get Started</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          #hamburger-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
