import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { ConcurrentLoginModal } from '../components/ConcurrentLoginModal';

const defaultAuthValue = {
  user: null,
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  hasSubscription: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  googleLogin: async () => ({ success: false }),
  logout: () => {},
  refreshUser: async () => {},
  updateUser: () => {}
};

const AuthContext = createContext(defaultAuthValue);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('runcode_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [concurrentSession, setConcurrentSession] = useState({
    isOpen: false,
    message: ''
  });

  const logout = useCallback(() => {
    localStorage.removeItem('runcode_token');
    localStorage.removeItem('runcode_user');
    setUser(null);
  }, []);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('runcode_token');
    if (!token) {
      localStorage.removeItem('runcode_user');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
        try {
          localStorage.setItem('runcode_user', JSON.stringify(data.user));
        } catch {}
      } else {
        logout();
      }
    } catch (error) {
      console.error('Foydalanuvchi ma\'lumotlarini olishda xatolik:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Boshqa qurilmadan kirilganda (CONCURRENT_LOGIN) hodisasi tinglovchisi
  useEffect(() => {
    const handleConcurrent = (e) => {
      logout();
      setConcurrentSession({
        isOpen: true,
        message: e.detail?.message || "Ushbu hisobga boshqa qurilmadan kirildi. Xavfsizlik yuzasidan joriy sessiyangiz yakunlandi."
      });
    };

    const handleInactivity = (e) => {
      logout();
      const msg = encodeURIComponent(e.detail?.message || "Xavfsizlik yuzasidan: 5 kun davomida kirmaganingiz sababli login va parol orqali qayta kiring.");
      window.location.href = `/login?message=${msg}`;
    };

    window.addEventListener('runcode:concurrent_login', handleConcurrent);
    window.addEventListener('runcode:inactivity_timeout', handleInactivity);
    return () => {
      window.removeEventListener('runcode:concurrent_login', handleConcurrent);
      window.removeEventListener('runcode:inactivity_timeout', handleInactivity);
    };
  }, [logout]);

  // Fonda faol sessiyani muntazam tekshirib turish (Heartbeat)
  useEffect(() => {
    if (!user) return;

    const checkCurrentSession = async () => {
      const token = localStorage.getItem('runcode_token');
      if (!token) return;
      try {
        await api.get('/auth/check-session');
      } catch (err) {
        // Interceptor orqali concurrent_login avtomatik ishlaydi
      }
    };

    // Har 15 soniyada bir marta tekshiradi
    const interval = setInterval(checkCurrentSession, 15000);

    // Foydalanuvchi sahifaga yoki oynaga qaytgan zahoti tekshiradi
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkCurrentSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user]);

  const login = async (identifier, password) => {
    const isEmail = identifier && identifier.includes('@');
    const payload = isEmail
      ? { email: identifier, password }
      : { username: identifier, email: identifier, password };
    const data = await api.post('/auth/login', payload);
    if (data.success && data.token) {
      localStorage.setItem('runcode_token', data.token);
      setUser(data.user);
      try {
        localStorage.setItem('runcode_user', JSON.stringify(data.user));
      } catch {}
    }
    return data;
  };

  const register = async (fullName, email, password) => {
    const data = await api.post('/auth/register', { fullName, email, password });
    if (data.success && data.token) {
      localStorage.setItem('runcode_token', data.token);
      setUser(data.user);
      try {
        localStorage.setItem('runcode_user', JSON.stringify(data.user));
      } catch {}
    }
    return data;
  };

  const googleLogin = async (email, fullName, googleId) => {
    const data = await api.post('/auth/google', { email, fullName, googleId });
    if (data.success && data.token) {
      localStorage.setItem('runcode_token', data.token);
      setUser(data.user);
      try {
        localStorage.setItem('runcode_user', JSON.stringify(data.user));
      } catch {}
    }
    return data;
  };

  const refreshUser = () => {
    return fetchCurrentUser();
  };

  const updateUser = (newUserData) => {
    setUser(prev => {
      const nextUser = { ...prev, ...newUserData };
      try {
        localStorage.setItem('runcode_user', JSON.stringify(nextUser));
      } catch {}
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        hasSubscription: !!user?.hasSubscription || user?.role === 'admin',
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
        updateUser
      }}
    >
      {children}
      <ConcurrentLoginModal
        isOpen={concurrentSession.isOpen}
        message={concurrentSession.message}
        onClose={() => setConcurrentSession({ isOpen: false, message: '' })}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || defaultAuthValue;
};
