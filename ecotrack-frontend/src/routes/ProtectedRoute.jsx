import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Wraps any route that requires authentication.
// If not authenticated → redirect to /login
// Passes the original location so login can redirect back after success.

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while auth state is being restored from localStorage
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--eco-bg)'
      }}>
        <div className="spinner" style={{
          width: 36,
          height: 36,
          border: '3px solid var(--eco-border)',
          borderTopColor: 'var(--eco-primary)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite'
        }} />
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based restriction
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
