import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import LoginScreen from '../pages/Login/LoginScreen.jsx';
import CricketUnsettled from '../pages/CricketUnsettled/CricketUnsettled.jsx';
import CricketUnsettledEvent from '../pages/CricketUnsettled/CricketUnsettledEvent.jsx';
import SoccerUnsettled from '../pages/SoccerUnsettled/SoccerUnsettled.jsx';
import TennisUnsettled from '../pages/TennisUnsettled/TennisUnsettled.jsx';
import { useAuth } from '../hooks/useAuth.js';

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cricket/unsettled" element={<CricketUnsettled />} />
        <Route
          path="/cricket/event/:eventId"
          element={<CricketUnsettledEvent />}
        />
        <Route path="/soccer" element={<SoccerUnsettled />} />
        <Route path="/tennis" element={<TennisUnsettled />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
