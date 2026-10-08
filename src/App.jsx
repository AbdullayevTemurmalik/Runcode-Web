import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PaymentModal } from './components/PaymentModal';
import { ScrollToTop } from './components/ScrollToTop';
import { MobileBottomBar } from './components/MobileBottomBar';

import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LessonViewPage } from './pages/LessonViewPage';
import { ExamPage } from './pages/ExamPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TariffsPage } from './pages/TariffsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { useSecurityShield } from './hooks/useSecurityShield';
import { SecurityCurtain } from './components/SecurityCurtain';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ message: "Kurslarni ko'rish va o'qish uchun avval tizimga kiring." }} />;
  return children;
};

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('1_month');

  const isCheckout = location.pathname.startsWith('/checkout') || location.pathname.startsWith('/payment');

  // Butun platforma bo'ylab nusxa olish va screenshotga qarshi global qalqon
  const { isPrtScnTriggered, warningMessage, isExempt } = useSecurityShield({
    enableAntiCopy: true,
    enableAntiScreenshot: true,
    enableBlurShield: false // Global sahifalarda blur sharti yo'q, faqat dars va imtihonda
  });

  const handleOpenPayment = (plan = '1_month') => {
    setSelectedPlan(plan);
    navigate(`/checkout?plan=${plan}`);
  };

  return (
    <div className={`flex flex-col ${isCheckout ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'} bg-gray-50 text-gray-900 dark:bg-[#0b0f19] dark:text-gray-100 transition-colors protected-container`}>
      <SecurityCurtain 
        isPrtScnTriggered={isPrtScnTriggered} 
        isWindowBlurred={false} 
        warningMessage={warningMessage}
        isExempt={isExempt}
      />
      <ScrollToTop />
      <Navbar onOpenPaymentModal={handleOpenPayment} />

      <main className={`flex-1 ${isCheckout ? 'overflow-hidden flex flex-col' : 'pb-24 md:pb-0'}`}>
        <Routes>
          <Route path="/" element={<HomePage onOpenPaymentModal={handleOpenPayment} />} />
          <Route path="/tariffs" element={<TariffsPage onOpenPaymentModal={handleOpenPayment} />} />
          <Route path="/premium" element={<TariffsPage onOpenPaymentModal={handleOpenPayment} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<CheckoutPage />} />
          <Route
            path="/courses"
            element={<CoursesPage onOpenPaymentModal={handleOpenPayment} />}
          />
          {/* Kurs haqida batafsil SPA sahifasi (Sammi.academy uslubida) */}
          <Route
            path="/courses/:courseSlug"
            element={<CourseDetailPage onOpenPaymentModal={handleOpenPayment} />}
          />
          {/* Kurs darsliklarini o'qish va amaliyot qilish oynasi */}
          <Route
            path="/courses/:courseSlug/learn"
            element={
              <ProtectedRoute>
                <LessonViewPage onOpenPaymentModal={handleOpenPayment} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseSlug/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <LessonViewPage onOpenPaymentModal={handleOpenPayment} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseSlug/exam"
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage onOpenPaymentModal={handleOpenPayment} />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isCheckout && <Footer />}
      {!isCheckout && <MobileBottomBar />}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        initialPlan={selectedPlan}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
