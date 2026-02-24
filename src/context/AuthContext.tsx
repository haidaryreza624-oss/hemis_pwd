import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiPost, apiGet } from '../api/api';

interface UserProfile {
  [key: string]: any;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginUser: (token: string) => void;
  logout: () => Promise<void>;
  logoutUser: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await apiGet('/profile');
          setUser(profile as UserProfile);
        } catch (err) {
          console.warn('Token validation failed, clearing token', err);
          setToken(null);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiPost('/login', { email, password });
    const newToken = response.token;
    loginUser(newToken);
    try {
      const profile = await apiGet('/profile');
      setUser(profile as UserProfile);
    } catch (e) {
      setUser(null);
    }
  };

  const loginUser = (t: string) => {
    setToken(t);
    localStorage.setItem('token', t);
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const logout = async () => {
    try {
      await apiPost('/logout', {});
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      logoutUser();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginUser, logout, logoutUser, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
