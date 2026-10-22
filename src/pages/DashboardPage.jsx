import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Crown, Sparkles, Award, ExternalLink } from 'lucide-react';
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
  const [certificates, setCertificates] = useState([]);
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

  const populateFieldsFromUser = useCallback((u) => {
    if (!u) return;
    const fName = u.firstName || u.first_name || (u.fullName ? u.fullName.split(' ')[0] : '') || '';
    const lName = u.lastName || u.last_name || (u.fullName ? u.fullName.split(' ').slice(1).join(' ') : '') || '';
    const rawBirth = u.birthDate || u.birth_date || '';
    const cleanBirth = rawBirth ? String(rawBirth).split('T')[0] : '';
    setFirstName(fName);
    setLastName(lName);
    setPhone(u.phone || '');
    setBirthDate(cleanBirth);
    setEmail(u.email || '');
  }, []);

  useEffect(() => {
    if (user && !isEditing) {
      populateFieldsFromUser(user);
    }
  }, [user, isEditing, populateFieldsFromUser]);

  const handleStartEdit = () => {
    populateFieldsFromUser(user);
    setIsEditing(true);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleCancelEdit = () => {
    populateFieldsFromUser(user);
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

      if (data && data.success && data.user) {
        updateUser(data.user);
        populateFieldsFromUser(data.user);
        setSaveSuccess(data.message || 'Profil ma\'lumotlaringiz muvaffaqiyatli saqlandi!');
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setSaveError(data?.message || 'Profilni yangilashda xatolik yuz berdi');
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
        const [orderRes, certRes] = await Promise.all([
          api.get('/payments/my-orders').catch(() => ({ success: false })),
          api.get('/certificates/my').catch(() => ({ success: false }))
        ]);
        if (orderRes && orderRes.success) setOrders(orderRes.orders || []);
        if (certRes && certRes.success) setCertificates(certRes.certificates || []);
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
        tier: 'Max',
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

    if (plan.includes('ultra') || plan.includes('max') || plan === '3_months') {
      return {
        tier: 'Max',
        title: 'Max Status',
        label: 'Max Obuna (3 Oylik)',
        badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        textColor: 'text-purple-400',
        accentBg: 'bg-purple-500/15 text-purple-400',
        borderGlow: 'border-purple-500/40 shadow-purple-500/10',
        icon: Crown,
        durationDays: 90,
        description: 'To\'liq dasturlash va VIP Telegram mentorlik'
      };
    }

    if (plan.includes('pro+') || plan.includes('pro_plus') || plan === '2_months') {
      return {
        tier: 'Pro+',
        title: 'Pro+ Status',
        label: 'Pro+ Obuna (2 Oylik)',
        badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        textColor: 'text-emerald-400',
        accentBg: 'bg-emerald-500/15 text-emerald-400',
        borderGlow: 'border-emerald-500/40 shadow-emerald-500/10',
        icon: ShieldCheck,
        durationDays: 60,
        description: 'Frontend dasturchi bo\'lish uchun eng optimal reja va amaliyot'
      };
    }

    if (plan === '1_month' || (plan.includes('pro') && !plan.includes('plus'))) {
      return {
        tier: 'Pro',
        title: 'Pro Status',
        label: 'Pro Obuna (1 Oylik)',
        badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        textColor: 'text-blue-400',
        accentBg: 'bg-blue-500/15 text-blue-400',
        borderGlow: 'border-blue-500/40 shadow-blue-500/10',
        icon: Sparkles,
        durationDays: 30,
        description: 'Tezkor amaliy ta\'lim va yopiq Telegram guruhi'
      };
    }

    // Default: Test Plus (7_days)
    return {
      tier: 'Test Plus',
      title: 'Test Plus Status',
      label: 'Test Plus Obuna (7 Kunlik)',
      badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      textColor: 'text-sky-400',
      accentBg: 'bg-sky-500/15 text-sky-400',
      borderGlow: 'border-sky-500/40 shadow-sky-500/10',
      icon: Sparkles,
      durationDays: 7,
      description: 'Platformani sinovdan o\'tkazish uchun 7 kunlik to\'liq kirish'
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
    <div className="container-custom py-4 sm:py-8 lg:py-12 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Legacy Account Security Notice */}
      {user?.isLegacy && !user?.email_verified && (
        <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-brand-500" />
            <span>
              Hisobingiz xavfsizligini oshirish va parolni oson tiklash uchun emailingizni tasdiqlashingiz tavsiya etiladi.
            </span>
          </div>
          {user.email && (
            <button
              onClick={() => navigate(`/verify-email?email=${encodeURIComponent(user.email)}`)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs whitespace-nowrap cursor-pointer transition-colors"
            >
              Tasdiqlash
            </button>
          )}
        </div>
      )}

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
        user={user}
        hasSubscription={hasSubscription}
        handleGetCommunityLink={handleGetCommunityLink}
        communityLoading={communityLoading}
        communityLink={communityLink}
        communityError={communityError}
        onOpenPaymentModal={onOpenPaymentModal}
        navigate={navigate}
      />

      {/* 5. Mening Sertifikatlarim */}
      {certificates && certificates.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c101c] border border-gray-200 dark:border-white/10 shadow-xl space-y-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Mening Sertifikatlarim
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kurslarni muvaffaqiyatli tamomlab qo'lga kiritilgan rasmiy sertifikatlar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                      № {cert.certificate_number}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {cert.score}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-2">
                    {cert.course_name}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Berilgan sana: {formatDate(cert.issued_at)}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Rasman Tasdiqlangan
                  </span>
                  <a
                    href={`/verify/${cert.certificate_number}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
                  >
                    <span>Ko'rish</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. To'lovlar Tarixi */}
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
