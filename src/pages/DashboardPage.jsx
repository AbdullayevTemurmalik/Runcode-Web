import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Send, 
  Lock, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Sparkles,
  Pencil,
  Check,
  X,
  Phone,
  AtSign,
  LogOut,
  Crown,
  Zap,
  Hourglass,
  ArrowRight,
  CheckCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogoutModal } from '../components/LogoutModal';
import { CustomInput } from '../components/CustomInput';
import { CustomDatePicker } from '../components/CustomDatePicker';

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

  const TierIcon = tierInfo.icon;

  return (
    <div className="container-custom py-10 sm:py-16 space-y-8">
      
      {/* 1. Header Profile Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-[#0b0f19] border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none ${
          tierInfo.tier === 'Ultra' ? 'bg-amber-500' : tierInfo.tier === 'Pro' ? 'bg-emerald-500' : 'bg-blue-500'
        }`} />

        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center font-black text-2xl shadow-inner">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-bold tracking-tight">{user?.fullName}</h1>
              {hasSubscription && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${tierInfo.badgeColor} border`}>
                  <TierIcon className="w-3 h-3 mr-1" />
                  {tierInfo.title}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 flex items-center mt-1">
              <Mail className="w-3.5 h-3.5 mr-1 text-gray-500" />
              {user?.email || 'Email kiritilmagan'}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {hasSubscription ? (
            <div className={`px-4 py-2.5 rounded-2xl bg-black/40 border ${tierInfo.borderGlow} backdrop-blur-md flex items-center space-x-3 shadow-lg`}>
              <div className={`w-10 h-10 rounded-xl ${tierInfo.accentBg} flex items-center justify-center font-bold`}>
                <TierIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-xs font-black uppercase tracking-wider ${tierInfo.textColor}`}>
                    {tierInfo.title}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] font-semibold text-gray-300">
                  {daysLeft} kun qoldi • {formatDate(user?.subscription?.end_date)} gacha
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onOpenPaymentModal ? onOpenPaymentModal('1_month') : navigate('/tariffs')}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Obunani Faollashtirish</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/80 hover:bg-rose-950/40 hover:border-rose-700/60 text-gray-300 hover:text-rose-400 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>

      {/* 2. YANGI: "Mening Obunam va Statusim" (Aktiv Obuna & Muddat Hisobi Bloki) */}
      <div className={`rounded-3xl bg-white dark:bg-[#0c0d12]/95 border ${hasSubscription ? tierInfo.borderGlow : 'border-gray-200 dark:border-white/10'} p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6 transition-all duration-300`}>
        
        {/* Yuqori qism: Sarlavha va Status Nishoni */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 dark:border-white/5 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              <TierIcon className="w-4 h-4" />
              <span>Obuna va Ta'lim Holati</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Mening Obunam va Statusim
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sizning platformadagi faol ta'lim tarifi, to'lov sanasi va qolgan muddat hisobi
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {hasSubscription ? (
              <div className="flex items-center space-x-2">
                <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 ${tierInfo.badgeColor} border shadow-sm`}>
                  <TierIcon className="w-4 h-4" />
                  <span>{tierInfo.title}</span>
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                  Aktiv
                </span>
              </div>
            ) : (
              <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                Bepul Reja
              </span>
            )}
          </div>
        </div>

        {/* 4 ta Asosiy Ko'rsatkich Kartochkalari */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Status / Tarif */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <TierIcon className={`w-4 h-4 ${hasSubscription ? tierInfo.textColor : 'text-gray-400'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Tarif Statusi</span>
            </div>
            <p className={`text-lg sm:text-xl font-black ${hasSubscription ? tierInfo.textColor : 'text-gray-900 dark:text-white'}`}>
              {tierInfo.title}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
              {tierInfo.label}
            </p>
          </div>

          {/* 2. To'lov Qilingan Sana */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <Calendar className="w-4 h-4 text-brand-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">To'langan Sana</span>
            </div>
            <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-mono">
              {hasSubscription ? formatDate(user?.subscription?.start_date) : '—'}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
              {hasSubscription ? 'Muvaffaqiyatli faollashgan' : 'Obuna yo\'q'}
            </p>
          </div>

          {/* 3. Amal Qilish Muddati */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Amal Qilish Muddati</span>
            </div>
            <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-mono">
              {hasSubscription ? formatDate(user?.subscription?.end_date) : 'Cheklanmagan'}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
              {hasSubscription ? 'Shu sanagacha to\'liq ochiq' : 'HTML ochiq'}
            </p>
          </div>

          {/* 4. Qolgan Muddat (Har kuni 1 kun kamayib boradi) */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <Hourglass className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Qolgan Muddat</span>
            </div>
            <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-mono">
              {hasSubscription ? `${daysLeft} kun qoldi` : '0 kun'}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
              {hasSubscription ? 'Har kuni 1 kun kamayadi' : 'Obuna kerak'}
            </p>
          </div>

        </div>

        {/* Visual Progress Bar (Kunlar nisbati) */}
        {hasSubscription && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Faollashgan: <strong className="text-gray-900 dark:text-white font-mono">{formatDate(user?.subscription?.start_date)}</strong> ({elapsedDays} kun o'tdi)
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                Tugash: <strong className={`font-mono ${tierInfo.textColor}`}>{formatDate(user?.subscription?.end_date)}</strong> ({daysLeft} kun qoldi)
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                  tierInfo.tier === 'Ultra' ? 'from-amber-500 via-orange-500 to-yellow-400' :
                  tierInfo.tier === 'Pro' ? 'from-brand-600 via-emerald-500 to-teal-400' :
                  'from-blue-600 via-indigo-500 to-cyan-400'
                }`}
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>Jami davomiylik: {totalDays} kun</span>
              <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{progressPercent}% muddat yakunlandi</span>
            </div>
          </div>
        )}

        {/* 🌟 NAVBATDAGI REJALASHTIRILGAN TARIF (Queued / Upcoming Subscription) */}
        {nextSub && nextTierInfo && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-purple-500/[0.05] to-emerald-500/[0.08] border border-amber-500/30 dark:border-amber-400/25 shadow-lg relative overflow-hidden space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${nextTierInfo.accentBg} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <nextTierInfo.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Navbatdagi Tarif
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Navbatda kutilmoqda
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                    {nextTierInfo.title} ({nextTierInfo.label})
                  </h3>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block">Avtomatik faollashish sanasi:</span>
                <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {formatDate(nextSub.start_date)} da
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-black/40 border border-amber-500/20 text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2.5 leading-relaxed">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Joriy <strong>{tierInfo.title}</strong> tarifi tugashi bilan (<strong className="font-mono text-gray-900 dark:text-white">{formatDate(user?.subscription?.end_date)}</strong>), ushbu <strong>{nextTierInfo.title}</strong> tarifi avtomatik tarzda soniyasida ishga tushadi va <strong className="font-mono text-gray-900 dark:text-white">{formatDate(nextSub.end_date)}</strong> gacha davom etadi. Hech bir kuningiz kuyib ketmaydi va to'xtalishsiz davom etadi!
              </span>
            </div>
          </div>
        )}

        {/* Obunaning Faol Imtiyozlari */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="font-medium">Barcha 4 ta kurs to'liq ochiq</span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="font-medium">Yopiq VIP Telegram mentorligi</span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="font-medium">Interaktiv kod muharriri (IDE)</span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="font-medium">20 ta savolli Yakuniy Imtihonlar</span>
          </div>
        </div>

        {/* Harakat Tugmasi */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {hasSubscription 
              ? 'Obuna muddati tugashidan oldin yangi tarif xarid qilsangiz, u joriy tarifingiz tugashi bilan navbatma-navbat ulanadi.'
              : 'Pullik obuna orqali barcha ilg\'or kurslar, topshiriqlar va mentorlikka ega bo\'ling.'}
          </p>

          <button
            type="button"
            onClick={() => onOpenPaymentModal ? onOpenPaymentModal('1_month') : navigate('/tariffs')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-brand-500/20 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>{hasSubscription ? 'Tarifni Uzaytirish / Yangilash' : 'Obunani Faollashtirish'}</span>
          </button>
        </div>

      </div>

      {/* 3. Shaxsiy Ma'lumotlar & Profil Tahrirlash (Pencil Icon) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0d12]/95 border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Shaxsiy Ma'lumotlar
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Profil sozlamalari va ma'lumotlaringiz
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-xs transition-colors shadow-sm"
              title="Ma'lumotlarni tahrirlash"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Tahrirlash</span>
            </button>
          )}
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInput
                label="Ism:"
                icon={User}
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ismingiz"
              />

              <CustomInput
                label="Familiya:"
                icon={User}
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Familiyangiz"
              />

              <CustomInput
                label="Telefon raqami:"
                icon={Phone}
                isPhone={true}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                inputClassName="font-mono font-medium"
              />

              <CustomDatePicker
                label="Tug'ilgan sana:"
                sublabel="Kun • Oy • Yil"
                value={birthDate}
                onChange={(val) => setBirthDate(val)}
              />

              <div className="sm:col-span-2">
                <CustomInput
                  label="Email manzili (Ixtiyoriy):"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@example.com (agar bo'lmasa, bo'sh qoldiring)"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saveLoading}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Bekor qilish</span>
              </button>

              <button
                type="submit"
                disabled={saveLoading}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
              >
                {saveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Saqlash</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">To'liq Ism</span>
              <p className="text-xs font-semibold text-gray-900 dark:text-white mt-1">{user?.fullName || '—'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Username</span>
              <p className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400 mt-1">@{user?.username || '—'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Telefon Raqami</span>
              <p className="text-xs font-mono font-semibold text-gray-900 dark:text-white mt-1">{user?.phone || 'Kiritilmagan'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email</span>
              <p className="text-xs font-semibold text-gray-900 dark:text-white mt-1 truncate">
                {user?.email || <span className="text-gray-400 italic font-normal">Kiritilmagan</span>}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tug'ilgan Sana</span>
              <p className="text-xs font-semibold text-gray-900 dark:text-white mt-1">
                {user?.birthDate ? new Date(user.birthDate).toLocaleDateString('uz-UZ') : 'Kiritilmagan'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ta'lim Holati & Status</span>
              <p className="text-xs font-semibold text-gray-900 dark:text-white mt-1 flex items-center">
                {hasSubscription ? (
                  <span className={`font-bold flex items-center ${tierInfo.textColor}`}>
                    <TierIcon className="w-3.5 h-3.5 mr-1" />
                    {tierInfo.title} ({daysLeft} kun qoldi)
                  </span>
                ) : (
                  <span className="text-gray-500">Bepul Talaba</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Yopiq Telegram Jamiyat Bloki */}
      <div className="p-8 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Yopiq Telegram Jamiyati & Middle Mentorlik
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Bu yerda har kuni tajribali middle dasturchilar sizning kodingizdagi xatolarni ko'rib chiqishadi, portfolio loyihalaringizga feedback berishadi va savollaringizga to'liq javob berishadi.
            </p>
          </div>

          <div>
            {hasSubscription ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGetCommunityLink}
                  disabled={communityLoading}
                  className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  {communityLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Telegram Guruhiga Kirish</span>
                </button>
                {communityLink && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold text-center">
                    Havola ochildi!
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center space-x-3 text-xs">
                <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  Faqat aktiv pullik obunachilar uchun ochiq
                </span>
                <button
                  onClick={() => onOpenPaymentModal ? onOpenPaymentModal('1_month') : navigate('/tariffs')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors"
                >
                  Obuna bo'lish
                </button>
              </div>
            )}
          </div>
        </div>

        {communityError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs">
            {communityError}
          </div>
        )}
      </div>

      {/* 3. To'lovlar Tarixi */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            To'lovlar Tarixi ({orders.length})
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
            To'lovlar tarixi mavjud emas
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4">Tarif</th>
                    <th className="px-6 py-4">Summa</th>
                    <th className="px-6 py-4">Usul</th>
                    <th className="px-6 py-4">Holat</th>
                    <th className="px-6 py-4">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {ord.plan_name === '1_month' || ord.plan_name === 'plus'
                          ? 'Plus Obuna (1 Oylik)'
                          : ord.plan_name === '2_months' || ord.plan_name === 'pro'
                          ? 'Pro Obuna (2 Oylik)'
                          : ord.plan_name === '3_months' || ord.plan_name === 'ultra'
                          ? 'Ultra Obuna (3 Oylik)'
                          : (ord.plan_name || 'Standart')}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white">
                        {(ord.amount || 0).toLocaleString()} so'm
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-500">
                        {ord.payment_method === 'apps' ? 'Ilova (Click/Payme)' : ord.payment_method === 'bankomat' ? 'Bankomat' : ord.payment_method === 'payme' ? 'Payme' : 'Karta / Ilova'}
                      </td>
                      <td className="px-6 py-4">
                        {ord.status === 'approved' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            Tasdiqlangan
                          </span>
                        ) : ord.status === 'rejected' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400" title={ord.rejection_reason}>
                            Rad etilgan: {ord.rejection_reason || 'Sabab ko\'rsatilmagan'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                            Kutilmoqda
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-[11px] font-mono">
                        {formatDate(ord.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
