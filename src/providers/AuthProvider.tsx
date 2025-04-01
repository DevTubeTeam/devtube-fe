import { AuthContext, AuthUser } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

interface JwtPayload {
  sub: string;
  name: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin';
  exp: number;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (token: string) => {
    Cookies.set('access_token', token, { secure: true, sameSite: 'Strict' });
    const decoded = jwtDecode<JwtPayload>(token);
    setUser({
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      avatar: decoded.avatar,
      role: decoded.role,
    });
    setAccessToken(token);
  };

  const logout = () => {
    Cookies.remove('access_token');
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          setUser({
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            avatar: decoded.avatar,
            role: decoded.role,
          });
          setAccessToken(token);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
