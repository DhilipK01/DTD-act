import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await api.getMe();
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const loginUser = async (email, password) => {
    const data = await api.login(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  const signupUser = async ({ fullName, email, password, age }) => {
    const data = await api.signup({ fullName, email, password, age });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  const loginWithOtp = async (email, otp) => {
    const data = await api.verifyOtp(email, otp);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  const sendOtpCode = async (email) => {
    return await api.sendOtp(email);
  };

  const resetPasswordUser = async ({ email, otp, newPassword }) => {
    const data = await api.resetPassword({ email, otp, newPassword });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  const logoutUser = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout API failed, continuing client logout');
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        loginUser,
        signupUser,
        loginWithOtp,
        sendOtpCode,
        resetPasswordUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
