import { useAuth } from '@/hooks';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * RequireRole component checks if the user has the required role.
 * If the user does not have the required role, it redirects to a 403 page.
 * @param {string} role - The required role for access.
 * @param {JSX.Element} children - The children components to render if the user has the required role.
 * @returns {JSX.Element} - The children components or a redirect to a 403 page.
 */

type RequireRoleProps = {
  role: 'admin' | 'user';
  children: JSX.Element;
};

export const RequireRole = ({ role, children }: RequireRoleProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== role) {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  return children;
};
