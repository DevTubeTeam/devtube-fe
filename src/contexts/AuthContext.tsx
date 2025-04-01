import { createContext } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  login: () => {},
  logout: () => {},
});
