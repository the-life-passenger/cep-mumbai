import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('mylocal_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('mylocal_token');
      if (token) {
        try {
          const user = await api.getMe();
          setAdminUser(user);
          localStorage.setItem('mylocal_user', JSON.stringify(user));
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('mylocal_token', res.token);
    const userData = { id: res.id, name: res.name, email: res.email, role: res.role };
    localStorage.setItem('mylocal_user', JSON.stringify(userData));
    setAdminUser(userData);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('mylocal_token');
    localStorage.removeItem('mylocal_user');
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ adminUser, login, logout, loading, isAuthenticated: !!adminUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
