import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, clearAccessToken, clearRefreshToken } from '../features/auth/authSlice';
import './Navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    clearAccessToken();
    clearRefreshToken();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeSidebar();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const navLinks = [
    { to: '/cricket/unsettled', label: 'Cricket', icon: '🏏' },
    { to: '/soccer', label: 'Soccer', icon: '⚽' },
    { to: '/tennis', label: 'Tennis', icon: '🎾' },
  ];

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">

          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${sidebarOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className="bar bar--top" />
            <span className="bar bar--mid" />
            <span className="bar bar--bot" />
          </button>

          {/* Brand */}
          <Link to="/" className="navbar__brand">
            <span className="navbar__title">Result Dashboard</span>
          </Link>

          {/* Desktop nav */}
          <nav className="navbar__nav">
            {navLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                <span className="navbar__link-icon">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="navbar__actions">
            <button className="navbar__user" title="Profile">U</button>
            <button className="navbar__logout" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}
        aria-hidden={!sidebarOpen}
      >
        {/* Sidebar header */}
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <span className="sidebar__logo">RD</span>
            <span className="sidebar__brand-name">Result Dashboard</span>
          </div>
          <button className="sidebar__close" onClick={closeSidebar} aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="sidebar__divider" />

        {/* Sidebar nav */}
        <nav className="sidebar__nav">
          <p className="sidebar__section-label">Navigation</p>
          {navLinks.map(({ to, label, icon }, idx) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              style={{ '--delay': `${idx * 0.06}s` }}
            >
              <span className="sidebar__link-icon">{icon}</span>
              <span>{label}</span>
              <svg className="sidebar__link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__divider" />

        {/* Sidebar footer */}
        <div className="sidebar__footer">
          <div className="sidebar__user-card">
            <div className="sidebar__user-avatar">U</div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">User</span>
              <span className="sidebar__user-role">Administrator</span>
            </div>
          </div>
          <button className="sidebar__logout" onClick={() => { closeSidebar(); handleLogout(); }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        <button
          type="button"
          className="bottom-nav__item"
        >
          <span className="bottom-nav__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polygon points="8 5 19 12 8 19 8 5" fill="currentColor" />
              <circle cx="5" cy="12" r="1.6" fill="currentColor" />
            </svg>
          </span>
          <span className="bottom-nav__label">Open Bets</span>
        </button>

        <button
          type="button"
          className="bottom-nav__item"
        >
          <span className="bottom-nav__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bottom-nav__label">Closed Bet</span>
        </button>

        <Link
          to="/"
          className="bottom-nav__item bottom-nav__item--home"
        >
          <span className="bottom-nav__icon bottom-nav__icon--home">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="currentColor" />
              <path d="M9.2 15.5V11h5.6v4.5" fill="none" stroke="#facc15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 11.2 12 8.5l3.5 2.7" fill="none" stroke="#facc15" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bottom-nav__label">Home</span>
        </Link>

        <button
          type="button"
          className="bottom-nav__item"
        >
          <span className="bottom-nav__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9 9h6v6H9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bottom-nav__label">Cancel Bets</span>
        </button>

        <button
          type="button"
          className="bottom-nav__item"
          onClick={handleLogout}
        >
          <span className="bottom-nav__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14 16 18 12 14 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="18" y1="12" x2="9" y2="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bottom-nav__label">Logout</span>
        </button>
      </nav>
    </>
  );
}

export default Navbar;
