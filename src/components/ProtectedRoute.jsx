import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mapRoleIdToNavRole } from '../config/navConfig';

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required, check if user has it
  if (requiredRole) {
    const userNavRole = user?.roleId ? mapRoleIdToNavRole(user.roleId) : null;
    if (userNavRole !== requiredRole) {
      // User doesn't have required role, redirect to dashboard
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;

