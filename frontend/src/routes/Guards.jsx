
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Check whether the user is authenticated.
export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading session...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

// Check whether the authenticated user has permission.
export function RequireRole({ roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading permissions...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = String(
    user.role?.role_name ||
    user.role?.name ||
    user.role_name ||
    user.roleName ||
    user.role ||
    ''
  ).trim().toLowerCase();

  const allowedRoles = roles.map(role =>
    String(role).trim().toLowerCase()
  );

  if (!allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to={homeForRole(userRole)}
        replace
      />
    );
  }

  return <Outlet />;
}

// Determine the correct dashboard for each role.
export function homeForRole(role) {
  const normalizedRole = String(role || '')
    .trim()
    .toLowerCase();

  switch (normalizedRole) {
    case 'admin':
      return '/admin/dashboard';

    case 'animation':
      return '/animation/dashboard';

    case 'secretary':
      return '/secretary/dashboard';

    default:
      return '/';
  }
}
