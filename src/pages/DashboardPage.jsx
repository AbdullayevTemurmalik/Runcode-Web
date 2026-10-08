import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Crown, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogoutModal } from '../components/LogoutModal';
import { DashboardHeaderBanner } from '../components/dashboard/DashboardHeaderBanner';
import { DashboardSubscriptionStatus } from '../components/dashboard/DashboardSubscriptionStatus';
import { DashboardProfileForm } from '../components/dashboard/DashboardProfileForm';
import { DashboardCommunityCard } from '../components/dashboard/DashboardCommunityCard';
import { DashboardOrdersTable } from '../components/dashboard/DashboardOrdersTable';

export const DashboardPage = ({ onOpenPaymentModal }) => {
  const { user, hasSubscription, updateUser, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/');
  };

  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityLink, setCommunityLink] = useState(null);
  const [communityError, setCommunityError] = useState(null);

  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Profilni tahrirlash holatlari (Pencil icon)
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.fullName?.split(' ')[0] || '');
      setLastName(user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '');
      setPhone(user.phone || '');
      setBirthDate(user.birthDate ? user.birthDate.split('T')[0] : '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleStartEdit = () => {
    if (user) {
      setFirstName(user.firstName || user.fullName?.split(' ')[0] || '');
      setLastName(user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '');
      setPhone(user.phone || '');
      setBirthDate(user.birthDate ? user.birthDate.split('T')[0] : '');
      setEmail(user.email || '');
    }
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancelEdit = () => {
    if (user) {
      setFirstName(user.firstName || user.fullName?.split(' ')[0] || '');
      setLastName(user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '');
      setPhone(user.phone || '');
      setBirthDate(user.birthDate ? user.birthDate.split('T')[0] : '');
      setEmail(user.email || '');
    }
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const data = await api.put('/auth/profile', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        birthDate: birthDate || null,
        email: email && email.trim() ? email.trim() : null
      });

      if (data.success && data.user) {
        updateUser(data.user);
        setSaveSuccess(data.message || 'Profil ma\'lumotlaringiz muvaffaqiyatli saqlandi!');
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(null), 4000);
      }
    } catch (err) {
      setSaveError(err.message || 'Profilni yangilashda xatolik yuz berdi');
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof refreshUser === 'function') {
          await refreshUser();
        }
        const orderRes = await api.get('/payments/my-orders');
        if (orderRes && orderRes.success) setOrders(orderRes.orders || []);
      } catch (err) {
        console.error('Kabinet ma\'lumotlarini olishda xatolik:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Himoyalangan Telegram linkini olish
  const handleGetCommunityLink = async () => {
    setCommunityLoading(true);
    setCommunityError(null);
    try {
      const data = await api.get('/subscription/community-link');
      if (data.success && data.link) {
        setCommunityLink(data.link);
        window.open(data.link, '_blank');
      }
    } catch (err) {
      setCommunityError(err.message || 'Guruh havolasini olishda xatolik yuz berdi');
    } finally {
      setCommunityLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getSubscriptionTierInfo = (subscription) => {
    if (user?.role === 'admin' && (!subscription || !subscription.is_active)) {
      return {
        tier: 'Ultra',
        title: 'Admin Status',
        label: 'Tizim Ma\'muri (Cheksiz Kirish)',
        badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        textColor: 'text-amber-400',
        accentBg: 'bg-amber-500/15 text-amber-400',
        borderGlow: 'border-amber-500/40 shadow-amber-500/10',
        icon: Crown,
        durationDays: 999,
        description: 'Barcha platforma kurslari va resurslariga cheksiz ma\'muriy ruxsat'
      };
    }

    if (!subscription || !subscription.is_active) {
      return {
        tier: 'Free',
        title: 'Free Status',
        label: 'Bepul Talaba',
        badgeColor: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        textColor: 'text-gray-400',
        accentBg: 'bg-gray-500/10',
        borderGlow: 'border-gray-700/60 shadow-gray-900/10',
        icon: ShieldCheck,
        durationDays: 0,
        description: 'HTML kursi va barcha asosiy amaliyotlar mutlaqo bepul'
      };
    }

    const plan = String(subscription.plan_name || '').toLowerCase();

    if (plan.includes('ultra') || plan === '3_months') {
      return {
        tier: 'Ultra',
        title: 'Ultra Status',
        label: 'Ultra Obuna (3 Oylik)',
        badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        textColor: 'text-amber-400',
        accentBg: 'bg-amber-500/15 text-amber-400',
        borderGlow: 'border-amber-500/40 shadow-amber-500/10',
        icon: Crown,
        durationDays: 90,
        description: 'To\'liq Full-Stack dasturlash va VIP Telegram mentorlik'
      };
    }

    if (plan.includes('pro') || plan === '2_months') {
      return {
        tier: 'Pro',
        title: 'Pro Status',
        label: 'Pro Obuna (2 Oylik)',
        badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        textColor: 'text-emerald-400',
        accentBg: 'bg-emerald-500/15 text-emerald-400',
        borderGlow: 'border-emerald-500/40 shadow-emerald-500/10',
        icon: ShieldCheck,
        durationDays: 60,
        description: 'Frontend dasturchi bo\'lish uchun eng optimal reja va amaliyot'
      };
    }

    // Default: Plus (1_month)
    return {
      tier: 'Plus',
      title: 'Plus Status',
      label: 'Plus Obuna (1 Oylik)',
      badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      textColor: 'text-blue-400',
      accentBg: 'bg-blue-500/15 text-blue-400',
      borderGlow: 'border-blue-500/40 shadow-blue-500/10',
      icon: Sparkles,
      durationDays: 30,
      description: 'Tezkor amaliy ta\'lim va yopiq Telegram mentorlik guruhi'
    };
  };

  const tierInfo = getSubscriptionTierInfo(user?.subscription);
  const daysLeft = getDaysLeft(user?.subscription?.end_date);

  // Navbatdagi rejalashtirilgan tarif (Queued Upcoming Plan)
  const nextSub = user?.nextSubscription || (user?.upcomingSubscriptions && user.upcomingSubscriptions[0]) || null;
  const nextTierInfo = nextSub ? getSubscriptionTierInfo(nextSub) : null;

  // Kunlar va progress hisobi
  const startDate = user?.subscription?.start_date ? new Date(user.subscription.start_date) : null;
  const endDate = user?.subscription?.end_date ? new Date(user.subscription.end_date) : null;
  const totalDays = (startDate && endDate)
    ? Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : (tierInfo.durationDays || 30);
  const elapsedDays = Math.max(0, Math.min(totalDays, totalDays - daysLeft));
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

  return (
    <div className="container-custom py-10 sm:py-16 space-y-8">
      {/* 1. Header Profile Banner */}
      <DashboardHeaderBanner
        user={user}
        hasSubscription={hasSubscription}
        tierInfo={tierInfo}
        daysLeft={daysLeft}
        formatDate={formatDate}
        onOpenPaymentModal={onOpenPaymentModal}
        navigate={navigate}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
      />

      {/* 2. "Mening Obunam va Statusim" */}
      <DashboardSubscriptionStatus
        user={user}
        hasSubscription={hasSubscription}
        tierInfo={tierInfo}
        daysLeft={daysLeft}
        formatDate={formatDate}
        nextSub={nextSub}
        nextTierInfo={nextTierInfo}
        totalDays={totalDays}
        elapsedDays={elapsedDays}
        progressPercent={progressPercent}
        onOpenPaymentModal={onOpenPaymentModal}
        navigate={navigate}
      />

      {/* 3. Shaxsiy Ma'lumotlar & Profil Tahrirlash */}
      <DashboardProfileForm
        user={user}
        isEditing={isEditing}
        handleStartEdit={handleStartEdit}
        handleCancelEdit={handleCancelEdit}
        handleSaveProfile={handleSaveProfile}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        phone={phone}
        setPhone={setPhone}
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        email={email}
        setEmail={setEmail}
        saveLoading={saveLoading}
        saveSuccess={saveSuccess}
        saveError={saveError}
        hasSubscription={hasSubscription}
        tierInfo={tierInfo}
        daysLeft={daysLeft}
      />

      {/* 4. Yopiq Telegram Jamiyat Bloki */}
      <DashboardCommunityCard
        hasSubscription={hasSubscription}
        handleGetCommunityLink={handleGetCommunityLink}
        communityLoading={communityLoading}
        communityLink={communityLink}
        communityError={communityError}
        onOpenPaymentModal={onOpenPaymentModal}
        navigate={navigate}
      />

      {/* 5. To'lovlar Tarixi */}
      <DashboardOrdersTable
        orders={orders}
        formatDate={formatDate}
      />

      {/* Custom Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        user={user}
      />
    </div>
  );
};
