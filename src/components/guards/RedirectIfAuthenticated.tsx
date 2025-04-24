import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const RedirectIfAuthenticated = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('RedirectIfAuthenticated', { isAuthenticated, user, location });

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectTo = user.role === 'admin' ? '/admin' : '/';
      if (location.pathname === '/auth') {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [isAuthenticated, user, location, navigate]);

  return children;
};
