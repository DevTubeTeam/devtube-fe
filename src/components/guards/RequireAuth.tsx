import { ROUTES } from '@/constants/routes';
import { AuthContext } from '@/contexts';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  console.log('RequireAuth', isAuthenticated, location.pathname, !!user, user);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
  }

  return children;
};
