import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('resolveflow_user');
    return saved ? JSON.parse(saved) : { name: 'Alex Rivera', role: 'ADMIN', email: 'admin@resolveflow.ai' };
  });

  const [token, setToken] = useState(() => localStorage.getItem('resolveflow_token') || 'demo-token-123');

  const login = async (email, password, role = 'ADMIN') => {
    try {
      const res = await axios.post('/api/auth/login', { email, password, role });
      const { token: newToken, ...userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('resolveflow_token', newToken);
      localStorage.setItem('resolveflow_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Invalid email or password';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('resolveflow_token');
    localStorage.removeItem('resolveflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
