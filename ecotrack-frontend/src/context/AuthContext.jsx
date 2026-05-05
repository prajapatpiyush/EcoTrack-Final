import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Context Creation ──────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── AuthProvider ──────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore user session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('ecotrack_token');
    const storedUser = localStorage.getItem('ecotrack_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Corrupted data — clear it
        localStorage.removeItem('ecotrack_token');
        localStorage.removeItem('ecotrack_user');
      }
    }
    setLoading(false);
  }, []);

  // ─── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback((authData) => {
    const userData = {
      username: authData.username,
      email: authData.email,
      role: authData.role,
    };
    setToken(authData.token);
    setUser(userData);
    localStorage.setItem('ecotrack_token', authData.token);
    localStorage.setItem('ecotrack_user', JSON.stringify(userData));
  }, []);

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ecotrack_token');
    localStorage.removeItem('ecotrack_user');
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const isAuthenticated = !!token && !!user;
  const isCitizen = user?.role === 'CITIZEN';
  const isCompany = user?.role === 'COMPANY';
  const isAdmin = user?.role === 'ADMIN';

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    isCitizen,
    isCompany,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
