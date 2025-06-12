import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAuthenticated = !!token;
  const isAuthorized = allowedRoles ? allowedRoles.includes(role) : true;

  return isAuthenticated && isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;