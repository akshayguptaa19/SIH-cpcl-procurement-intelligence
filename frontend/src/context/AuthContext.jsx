import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, getStoredUser, setStoredUser } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setTokenState] = useState(() => getAuthToken());
  const [isLoading, setIsLoading] = useState(true);

  const isOfficer = user && (user.role === 'ADMIN' || user.role === 'PROCUREMENT_OFFICER' || user.role === 'SENIOR_OFFICER' || user.role === 'COMPLIANCE_REVIEWER' || user.role === 'OFFICER');
  const isBidder = user && user.role === 'BIDDER';
  const isAdmin = user && user.role === 'ADMIN';

  // Sync token state
  const updateAuth = (newToken, newUser) => {
    setAuthToken(newToken);
    setStoredUser(newUser);
    setTokenState(newToken);
    setUser(newUser);
  };

  const logout = () => {
    updateAuth(null, null);
  };

  // Check auth session on startup
  useEffect(() => {
    async function verifySession() {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const freshUser = await api.auth.getMe();
        updateAuth(storedToken, freshUser);
      } catch (err) {
        console.warn('Session check failed, logging out:', err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();

    const handleExpired = () => logout();
    window.addEventListener('cpcl-auth-expired', handleExpired);
    return () => window.removeEventListener('cpcl-auth-expired', handleExpired);
  }, []);

  const loginOfficer = async (credentials) => {
    const res = await api.auth.loginOfficer(credentials);
    updateAuth(res.token, res.user);
    return res;
  };

  const registerOfficer = async (data) => {
    return await api.auth.registerOfficer(data);
  };

  const loginBidder = async (credentials) => {
    const res = await api.auth.loginBidder(credentials);
    updateAuth(res.token, res.user);
    return res;
  };

  const registerBidder = async (data) => {
    const res = await api.auth.registerBidder(data);
    updateAuth(res.token, res.user);
    return res;
  };

  const refreshUser = async () => {
    try {
      const freshUser = await api.auth.getMe();
      updateAuth(token, freshUser);
      return freshUser;
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    role: user?.role || null,
    isOfficer,
    isBidder,
    isAdmin,
    loginOfficer,
    registerOfficer,
    loginBidder,
    registerBidder,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
