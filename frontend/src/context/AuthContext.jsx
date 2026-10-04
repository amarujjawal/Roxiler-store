import React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('roxiler_token');

    if (!token) {
      setLoading(false);
      return () => { active = false; };
    }

    api.get('/auth/me')
      .then(({ data }) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('roxiler_token');
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const login = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', {
      email: String(email || '').trim(),
      password,
    });

    localStorage.setItem('roxiler_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async ({ name, email, address, password }) => {
    const { data } = await api.post('/auth/signup', {
      name,
      email: String(email || '').trim(),
      address,
      password,
    });
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('roxiler_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
