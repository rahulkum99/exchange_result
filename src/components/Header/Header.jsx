import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogTitleId = useId();
  const menuId = useId();

  const onLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="appHeader">
      <div className="appHeader__inner">
        <button
          type="button"
          className="appHeader__burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-controls={menuId}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="appHeader__burgerLines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <button
          type="button"
          className="appHeader__brand"
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          aria-label="Go to start"
        >
          <span className="appHeader__mark">K</span>
          <span className="appHeader__name">King Admin</span>
        </button>

        <div className="appHeader__right">
          <span
            className={
              isAuthenticated ? 'appHeader__chip appHeader__chip--ok' : 'appHeader__chip'
            }
          >
            {isAuthenticated ? 'Online' : 'Guest'}
          </span>

          {isAuthenticated ? (
            <button
              type="button"
              className="appHeader__btn appHeader__btn--danger"
              onClick={onLogout}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="appHeader__btn appHeader__btn--primary"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Slide-in menu */}
      <div
        className={menuOpen ? 'sideMenu sideMenu--open' : 'sideMenu'}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="sideMenu__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
        />

        <aside
          id={menuId}
          className="sideMenu__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
        >
          <div className="sideMenu__head">
            <div>
              <div className="sideMenu__title" id={dialogTitleId}>
                Menu
              </div>
              <div className="sideMenu__sub">
                {isAuthenticated ? 'Signed in' : 'Guest'}
              </div>
            </div>

            <button
              type="button"
              className="sideMenu__close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="sideMenu__body">
            <button
              type="button"
              className="sideMenu__item"
              onClick={() => {
                setMenuOpen(false);
                navigate('/dashboard');
              }}
              disabled={!isAuthenticated}
            >
              <span className="sideMenu__itemIcon">📊</span>
              <span className="sideMenu__itemText">
                <strong>Dashboard</strong>
                <span>Overview</span>
              </span>
            </button>

            <button
              type="button"
              className="sideMenu__item"
              onClick={() => {
                setMenuOpen(false);
                navigate('/markets/match-odds?sport=cricket');
              }}
              disabled={!isAuthenticated}
            >
              <span className="sideMenu__itemIcon">🏏</span>
              <span className="sideMenu__itemText">
                <strong>Cricket</strong>
                <span>Matches</span>
              </span>
            </button>

            <button
              type="button"
              className="sideMenu__item"
              onClick={() => {
                setMenuOpen(false);
                navigate('/markets/match-odds?sport=soccer');
              }}
              disabled={!isAuthenticated}
            >
              <span className="sideMenu__itemIcon">⚽</span>
              <span className="sideMenu__itemText">
                <strong>Soccer</strong>
                <span>Matches</span>
              </span>
            </button>

            <button
              type="button"
              className="sideMenu__item"
              onClick={() => {
                setMenuOpen(false);
                navigate('/markets/match-odds?sport=tennis');
              }}
              disabled={!isAuthenticated}
            >
              <span className="sideMenu__itemIcon">🎾</span>
              <span className="sideMenu__itemText">
                <strong>Tennis</strong>
                <span>Matches</span>
              </span>
            </button>
          </div>
        </aside>
      </div>
    </header>
  );
};

export default Header;

