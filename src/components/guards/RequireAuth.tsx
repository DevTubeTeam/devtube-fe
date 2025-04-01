import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
