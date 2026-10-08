import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Code2, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers, 
  CreditCard,
  Star,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { LogoutModal } from './LogoutModal';

export const Navbar = ({ onOpenPaymentModal }) => {
  const { user, isAuthenticated, logout, isAdmin, hasSubscription } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Bosh sahifa', path: '/' },
    { label: 'Kurslar', path: '/courses' },
    { label: 'Tariflar (Premium)', path: '/tariffs' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left Side: Logo & Navigation Links (Dashboard & sammi.academy uslubida) */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            {/* Logo */}
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center leading-none">
                  RunCode<span className="text-brand-500">.uz</span>
                </span>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 tracking-wider uppercase mt-1">
                  By Temurmalik
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links (Chap tomonda logotip yonida) */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                    location.pathname === item.path
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10 border border-brand-500/20 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions: Theme Toggle, Notifications, User Profile / Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Rejimni o'zgartirish"
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>

            {/* Notifications Menu (if authenticated) */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsProfileOpen(false);
                  }}
                  className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  aria-label="Xabarlar"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotifOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotifOpen(false)} 
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-brand-500" />
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">Xabarnomalar</span>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            Barchasini o'qilgan qilish
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            Hozircha yangi xabarlar yo'q
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`p-4 transition-colors cursor-pointer ${
                                notif.is_read
                                  ? 'bg-transparent'
                                  : 'bg-brand-50/50 dark:bg-brand-500/5'
                              } hover:bg-gray-50 dark:hover:bg-gray-800/40`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="mt-0.5">
                                  {notif.type === 'payment_approved' ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  ) : notif.type === 'payment_rejected' ? (
                                    <X className="w-4 h-4 text-rose-500" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-brand-500" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                                    {notif.message}
                                  </p>
                                  <span className="text-[10px] text-gray-400 mt-1 block">
                                    {new Date(notif.created_at).toLocaleTimeString('uz-UZ', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Profile Dropdown / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200 hidden sm:inline max-w-[100px] truncate">
                    {user?.fullName}
                  </span>
                </button>

                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)} 
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        {hasSubscription ? (
                          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Aktiv Obuna
                          </span>
                        ) : (
                          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            Bepul Tarif
                          </span>
                        )}
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-gray-400" />
                        Shaxsiy Kabinet
                      </Link>

                      {isAdmin && (
                        <a
                          href="http://localhost:5174"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center px-4 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 mr-2.5" />
                          Admin Panelga O'tish
                        </a>
                      )}

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                        className="w-full flex items-center px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Chiqish
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-600 transition-colors"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition-all"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modern Custom Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        user={user}
      />
    </nav>
  );
};
