import { useAuth } from '@/hooks';
import { Navigate, useLocation } from 'react-router-dom';

interface IRequireRole {
  role: 'admin' | 'user';
  children: JSX.Element;
}

export const RequireRole = ({ role, children }: IRequireRole) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== role) {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  return children;
};
