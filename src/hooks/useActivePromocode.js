import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const PROMO_STORAGE_KEY = 'runcode_active_promocode';
const PROMO_EVENT_NAME = 'runcode:promocode_change';

export const PLAN_BASE_AMOUNTS = {
  '7_days': { standard: 15000, original: 25000 },
  '1_month': { standard: 40000, original: 60000 },
  '2_months': { standard: 70000, original: 100000 },
  '3_months': { standard: 100000, original: 140000 }
};

export const formatRemainingCountdown = (expiresAt) => {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;

  const totalSecs = Math.floor(diff / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');

  if (days > 0) {
    return `${days} kun ${hh}:${mm}:${ss}`;
  }
  return `${hh}:${mm}:${ss}`;
};

export const getStoredPromocode = () => {
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(PROMO_STORAGE_KEY);
      return null;
    }
    return {
      ...parsed,
      excludedPlans: Array.isArray(parsed.excludedPlans) ? parsed.excludedPlans : []
    };
  } catch (e) {
    return null;
  }
};

export const setStoredPromocode = (promo) => {
  try {
    if (!promo) {
      localStorage.removeItem(PROMO_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(PROMO_EVENT_NAME, { detail: null }));
    } else {
      const existing = getStoredPromocode();
      const safeExcludedPlans = Array.isArray(promo.excludedPlans) && promo.excludedPlans.length > 0
        ? promo.excludedPlans
        : (Array.isArray(promo.excludedPlans)
            ? (Array.isArray(existing?.excludedPlans) && existing.excludedPlans.length > 0 ? existing.excludedPlans : promo.excludedPlans)
            : (Array.isArray(existing?.excludedPlans) ? existing.excludedPlans : []));

      const toStore = {
        ...promo,
        excludedPlans: safeExcludedPlans
      };
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(toStore));
      window.dispatchEvent(new CustomEvent(PROMO_EVENT_NAME, { detail: toStore }));
    }
  } catch (e) {
    // ignore
  }
};

export const useActivePromocode = () => {
  const [activePromo, setActivePromo] = useState(() => getStoredPromocode());
  const [countdownText, setCountdownText] = useState(() => {
    const stored = getStoredPromocode();
    return stored?.expiresAt ? formatRemainingCountdown(stored.expiresAt) : null;
  });

  // Event & Storage listener
  useEffect(() => {
    const handleSync = (e) => {
      const updated = e?.detail !== undefined ? e.detail : getStoredPromocode();
      setActivePromo(updated);
      setCountdownText(updated?.expiresAt ? formatRemainingCountdown(updated.expiresAt) : null);
    };

    window.addEventListener(PROMO_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(PROMO_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Real-time interval for countdown timer (ticking backwards every second)
  useEffect(() => {
    if (!activePromo?.expiresAt) {
      setCountdownText(null);
      return;
    }

    // Har soniyada teskari hisoblash
    const interval = setInterval(() => {
      const text = formatRemainingCountdown(activePromo.expiresAt);
      if (!text) {
        // Muddati tugadi!
        setStoredPromocode(null);
        setActivePromo(null);
        setCountdownText(null);
        clearInterval(interval);
      } else {
        setCountdownText(text);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activePromo?.expiresAt]);

  // Backend bilan tekshirish: agar admin promokodni bazadan o'chirgan bo'lsa,
  // barcha foydalanuvchilar sessiyasidan avtomatik o'chiriladi!
  useEffect(() => {
    const verifyPromocodeWithBackend = async () => {
      const stored = getStoredPromocode();
      if (!stored?.code) return;

      try {
        const res = await api.get(`/promocodes/check/${stored.code}`);
        if (!res || !res.success || !res.promo) {
          setStoredPromocode(null);
          setActivePromo(null);
          setCountdownText(null);
        }
      } catch (err) {
        // 404 yoki o'chirilgan
        setStoredPromocode(null);
        setActivePromo(null);
        setCountdownText(null);
      }
    };

    verifyPromocodeWithBackend();

    window.addEventListener('focus', verifyPromocodeWithBackend);
    const checkInterval = setInterval(verifyPromocodeWithBackend, 20000);

    return () => {
      window.removeEventListener('focus', verifyPromocodeWithBackend);
      clearInterval(checkInterval);
    };
  }, []);

  const applyPromocode = useCallback(async (code) => {
    const cleanCode = String(code || '').trim().toUpperCase();
    if (!cleanCode) {
      throw new Error('Iltimos, promokod nomini kiriting.');
    }

    const res = await api.post('/promocodes/apply', { code: cleanCode });
    if (!res || !res.success || !res.promo) {
      throw new Error(res?.message || 'Promokod yaroqsiz yoki topilmadi.');
    }

    const promoData = {
      code: res.promo.code,
      discountPercent: res.promo.discountPercent,
      excludedPlans: res.promo.excludedPlans || [],
      expiresAt: res.promo.expiresAt,
      remainingSeconds: res.promo.remainingSeconds,
      plans: res.plans || null
    };

    setStoredPromocode(promoData);
    setActivePromo(promoData);
    setCountdownText(formatRemainingCountdown(promoData.expiresAt));

    return { success: true, message: res.message, promo: promoData };
  }, []);

  const removePromocode = useCallback(() => {
    setStoredPromocode(null);
    setActivePromo(null);
    setCountdownText(null);
  }, []);

  // Helper to compute plan pricing considering active promocode
  const getPlanPricing = useCallback((planId, fallbackStandardPrice = null, fallbackOriginalPrice = null) => {
    const baseDef = PLAN_BASE_AMOUNTS[planId];
    const standardAmount = baseDef ? baseDef.standard : (fallbackStandardPrice ? parseInt(String(fallbackStandardPrice).replace(/\D/g, ''), 10) : 0);
    const originalAmount = baseDef ? baseDef.original : (fallbackOriginalPrice ? parseInt(String(fallbackOriginalPrice).replace(/\D/g, ''), 10) : 0);

    const formatPrice = (num) => `${num.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm`;

    const standardPriceStr = formatPrice(standardAmount);
    const originalPriceStr = originalAmount > 0 ? formatPrice(originalAmount) : null;

    if (!activePromo) {
      return {
        isDiscounted: false,
        isExcluded: false,
        discountPercent: 0,
        currentPrice: standardPriceStr,
        strikethroughPrice: originalPriceStr,
        currentAmount: standardAmount,
        originalAmount
      };
    }

    const isExcluded = Array.isArray(activePromo.excludedPlans) && activePromo.excludedPlans.includes(planId);

    if (isExcluded) {
      return {
        isDiscounted: false,
        isExcluded: true,
        discountPercent: 0,
        currentPrice: standardPriceStr,
        strikethroughPrice: originalPriceStr,
        currentAmount: standardAmount,
        originalAmount,
        excludedMessage: "Bu tarifda chegirma yo'q"
      };
    }

    const discountAmount = Math.round((standardAmount * activePromo.discountPercent) / 100);
    const finalAmount = Math.max(0, standardAmount - discountAmount);
    const finalPriceStr = formatPrice(finalAmount);

    return {
      isDiscounted: true,
      isExcluded: false,
      discountPercent: activePromo.discountPercent,
      currentPrice: finalPriceStr,
      strikethroughPrice: standardPriceStr,
      superOriginalPrice: originalPriceStr,
      currentAmount: finalAmount,
      discountAmount,
      originalAmount: standardAmount,
      badgeText: `-${activePromo.discountPercent}% Chegirma`
    };
  }, [activePromo]);

  return {
    activePromo,
    countdownText,
    isApplied: !!activePromo,
    applyPromocode,
    removePromocode,
    getPlanPricing
  };
};
