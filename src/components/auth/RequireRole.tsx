import { useAuth } from '@/hooks/useAuth';
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface RequireRoleProps {
  children: ReactNode;
  role: string | string[];
}

const RequireRole: FC<RequireRoleProps> = ({ children, role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page
    return <Navigate to="/auth/callback" replace />;
  }

  // Check if user has the required role(s)
  const hasRequiredRole = Array.isArray(role)
    ? role.some(r => user?.roles?.includes(r))
    : user?.roles?.includes(role);

  if (!hasRequiredRole) {
    // Redirect to access denied page
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
