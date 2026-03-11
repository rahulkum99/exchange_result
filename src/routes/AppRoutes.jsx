import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import LoginScreen from '../pages/Login/LoginScreen.jsx';
import { useAuth } from '../hooks/useAuth.js';
import AdminLayout from '../components/AdminLayout/AdminLayout.jsx';
import MatchOdds from '../pages/Markets/MatchOdds/MatchOdds.jsx';
import TossMarket from '../pages/Markets/TossMarket/TossMarket.jsx';
import BackLay from '../pages/Markets/BackLay/BackLay.jsx';
import Settlement from '../pages/Settlement/Settlement.jsx';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root and /login both go through PublicRoute */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/markets" element={<MatchOdds />} />
          <Route path="/markets/toss" element={<TossMarket />} />
          <Route path="/markets/back-lay" element={<BackLay />} />
          <Route path="/settlement" element={<Settlement />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

