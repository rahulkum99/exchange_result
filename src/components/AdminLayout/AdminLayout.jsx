import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="adminLayout">
      <Header />
      <div className="adminLayout__body">
        <Sidebar />
        <main className="adminLayout__main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;

