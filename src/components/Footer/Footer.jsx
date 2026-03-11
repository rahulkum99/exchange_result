import './Footer.css';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="appFooter">
      <div className="appFooter__inner">
        <div className="appFooter__left">
          <div className="appFooter__brand">© {year} King Admin</div>
          <div className="appFooter__meta">Operator panel</div>
        </div>

        <nav className="appFooter__nav" aria-label="Footer links">
          <NavLink className="appFooter__link" to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className="appFooter__link" to="/markets?sport=cricket">
            Cricket
          </NavLink>
          <NavLink className="appFooter__link" to="/markets?sport=soccer">
            Soccer
          </NavLink>
          <NavLink className="appFooter__link" to="/markets?sport=tennis">
            Tennis
          </NavLink>
        </nav>

        <div className="appFooter__right">Built with React + Vite</div>
      </div>
    </footer>
  );
};

export default Footer;

