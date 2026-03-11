import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="sidebar__inner">
        <div className="sidebar__section">
          <div className="sidebar__title">Admin</div>

          <nav className="sidebar__nav">
            <NavLink className="sidebar__link" to="/dashboard">
              <span className="sidebar__icon">📊</span>
              <span>Dashboard</span>
            </NavLink>

            <div className="sidebar__groupLabel">Sports</div>

            <NavLink className="sidebar__link" to="/markets?sport=cricket">
              <span className="sidebar__icon">🏏</span>
              <span>Cricket</span>
            </NavLink>

            <NavLink className="sidebar__link" to="/markets?sport=soccer">
              <span className="sidebar__icon">⚽</span>
              <span>Soccer</span>
            </NavLink>

            <NavLink className="sidebar__link" to="/markets?sport=tennis">
              <span className="sidebar__icon">🎾</span>
              <span>Tennis</span>
            </NavLink>

            {/* <div className="sidebar__groupLabel">Markets</div>

            <NavLink className="sidebar__link" to="/markets">
              <span className="sidebar__icon">🎯</span>
              <span>Markets</span>
            </NavLink>

            <NavLink className="sidebar__link" to="/markets/toss">
              <span className="sidebar__icon">🪙</span>
              <span>Toss</span>
            </NavLink>

            <NavLink className="sidebar__link" to="/markets/back-lay">
              <span className="sidebar__icon">📈</span>
              <span>Back / Lay</span>
            </NavLink> */}

            <div className="sidebar__groupLabel">Settlement</div>

            <NavLink className="sidebar__link" to="/settlement">
              <span className="sidebar__icon">✅</span>
              <span>Game Settlement</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__hint">Tip: use the burger menu on mobile</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

