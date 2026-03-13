import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, clearAccessToken, clearRefreshToken } from '../features/auth/authSlice';
import './Navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    clearAccessToken();
    clearRefreshToken();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo-circle">R</span>
          <span className="navbar__title">Result Dashboard</span>
        </Link>

        <div className="navbar__right">
          <nav className="navbar__nav">
            <NavLink
              to="/cricket/unsettled"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Cricket
            </NavLink>
            <NavLink
              to="/soccer"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Soccer
            </NavLink>
            <NavLink
              to="/tennis"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Tennis
            </NavLink>
          </nav>

          <div className="navbar__actions">
            <button className="navbar__user">U</button>
            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
