import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * useSecurityShield
 * 
 * Saytdagi darslar, imtihonlar va o'quv materiallarini
 * nusxa ko'chirish (copy, cut, select, right click) va skrinshot (PrintScreen, Snipping tool, flameshot, Mac screenshot)
 * lardan maksimal darajada himoya qiluvchi React hook.
 * 
 * Maxsus istisno (Exemption):
 * Agar foydalanuvchi admin yoki 'temur' / 'temurmalik' bo'lsa,
 * xatoliklarni tekshirish, skrinshot qilish va matnlarni ko'chirib olish uchun
 * barcha cheklovlar to'liq bekor qilinadi (bypass).
 */
export const useSecurityShield = (options = {}) => {
  const { user } = useAuth();
  const storedUser = (() => {
    try {
      const u = localStorage.getItem('runcode_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();
  const effectiveUser = user || storedUser;
  const username = (effectiveUser?.username || '').trim().toLowerCase();
  const isExempt = Boolean(
    effectiveUser?.role === 'admin' || 
    username === 'temur' || 
    username === 'temurmalik' ||
    username.startsWith('temur') ||
    localStorage.getItem('runcode_admin_token') ||
    localStorage.getItem('runcode_exempt') === 'true'
  );

  const {
    enableAntiCopy = true,
    enableAntiScreenshot = true,
    enableBlurShield = true, // Snipping tool / tashqi dastur ishga tushganda ekran qoraytirilishi
    onWarning = null
  } = options;

  const [isPrtScnTriggered, setIsPrtScnTriggered] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);

  // Body klassini admin/temur uchun dinamik sozlash
  useEffect(() => {
    if (isExempt) {
      document.body.classList.add('security-exempt');
    } else {
      document.body.classList.remove('security-exempt');
    }
    return () => {
      document.body.classList.remove('security-exempt');
    };
  }, [isExempt]);

  const showSecurityWarning = useCallback((msg) => {
    if (isExempt) return;
    setWarningMessage(msg);
    if (onWarning) onWarning(msg);
    const timer = setTimeout(() => {
      setWarningMessage(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isExempt, onWarning]);

  // Nusxalash va Clipboard ni tozalash
  const clearClipboard = useCallback(() => {
    if (isExempt) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('').catch(() => {});
      }
    } catch (e) {
      // Ignored
    }
  }, [isExempt]);

  useEffect(() => {
    if (isExempt || (!enableAntiCopy && !enableAntiScreenshot)) return;

    // 1. O'ng tugma (Context Menu) ni bloklash
    const handleContextMenu = (e) => {
      if (!enableAntiCopy) return;
      e.preventDefault();
      showSecurityWarning("Nusxa ko'chirish va kontekst menyu cheklangan 🔒");
    };

    // 2. Nusxa olish (Copy) va qirqish (Cut) ni bloklash
    const handleCopy = (e) => {
      if (!enableAntiCopy) return;
      e.preventDefault();
      clearClipboard();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '');
      }
      showSecurityWarning("Materiallardan nusxa olish taqiqlangan 🔒");
    };

    const handleCut = (e) => {
      if (!enableAntiCopy) return;
      e.preventDefault();
      clearClipboard();
      showSecurityWarning("Matnni qirqib olish taqiqlangan 🔒");
    };

    // 3. Matnni sudrab tortish (Drag) va belgilash (selectstart) ni bloklash
    const handleDragStart = (e) => {
      if (!enableAntiCopy) return;
      e.preventDefault();
    };

    const handleSelectStart = (e) => {
      if (!enableAntiCopy) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
        return;
      }
      e.preventDefault();
    };

    // 4. Klaviatura kombinatsiyalarini ushlash va bloklash
    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = e.key ? e.key.toLowerCase() : '';
      const keyCode = e.keyCode || e.which;

      // PrintScreen / Fn + PrtScn tugmasi (Windows, Linux, Mac)
      if (e.key === 'PrintScreen' || keyCode === 44 || key === 'printscreen') {
        e.preventDefault();
        clearClipboard();
        setIsPrtScnTriggered(true);
        showSecurityWarning("⚠️ Skrinshot olish qat'iyan man etiladi! Mualliflik huquqi himoyalangan.");
        setTimeout(() => {
          setIsPrtScnTriggered(false);
          clearClipboard();
        }, 1800);
        return false;
      }

      // Mac skrinshot kombinatsiyalari (Cmd + Shift + 3 / 4 / 5)
      if (isCtrlOrCmd && e.shiftKey && (key === '3' || key === '4' || key === '5' || key === '6' || keyCode === 51 || keyCode === 52 || keyCode === 53)) {
        e.preventDefault();
        clearClipboard();
        setIsPrtScnTriggered(true);
        showSecurityWarning("⚠️ Skrinshot olish qat'iyan man etiladi! Mualliflik huquqi himoyalangan.");
        setTimeout(() => {
          setIsPrtScnTriggered(false);
          clearClipboard();
        }, 1800);
        return false;
      }

      if (isCtrlOrCmd) {
        // Ctrl+C (Nusxalash)
        if (key === 'c' || keyCode === 67) {
          e.preventDefault();
          clearClipboard();
          showSecurityWarning("Nusxa olish (Ctrl+C) bloklangan 🔒");
          return false;
        }

        // Ctrl+X (Qirqish)
        if (key === 'x' || keyCode === 88) {
          e.preventDefault();
          clearClipboard();
          return false;
        }

        // Ctrl+A (Barchasini belgilash)
        if (key === 'a' || keyCode === 65) {
          e.preventDefault();
          return false;
        }

        // Ctrl+P (Chop etish - Print)
        if (key === 'p' || keyCode === 80) {
          e.preventDefault();
          showSecurityWarning("Darsliklarni chop etish (Ctrl+P) cheklangan 🔒");
          return false;
        }

        // Ctrl+S (Sahifani saqlash)
        if (key === 's' || keyCode === 83) {
          e.preventDefault();
          return false;
        }

        // Ctrl+U (Sahifa kodini ko'rish)
        if (key === 'u' || keyCode === 85) {
          e.preventDefault();
          return false;
        }

        // Devtools: Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || key === 's')) {
          e.preventDefault();
          showSecurityWarning("Dasturchi asboblari va skrinshot cheklangan 🔒");
          return false;
        }
      }

      // F12 (Devtools)
      if (e.key === 'F12' || keyCode === 123) {
        e.preventDefault();
        return false;
      }
    };

    // 5. Snipping Tool va tashqi dasturlardan himoya: Oyna fokusi yo'qolganda
    const handleBlur = () => {
      if (!enableBlurShield) return;
      setIsWindowBlurred(true);
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (!enableBlurShield) return;
      if (document.visibilityState === 'hidden') {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('copy', handleCopy, true);
    window.addEventListener('cut', handleCut, true);
    window.addEventListener('dragstart', handleDragStart, true);
    window.addEventListener('selectstart', handleSelectStart, true);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        clearClipboard();
      }
    }, true);

    if (enableBlurShield) {
      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('copy', handleCopy, true);
      window.removeEventListener('cut', handleCut, true);
      window.removeEventListener('dragstart', handleDragStart, true);
      window.removeEventListener('selectstart', handleSelectStart, true);
      window.removeEventListener('keydown', handleKeyDown, true);

      if (enableBlurShield) {
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [enableAntiCopy, enableAntiScreenshot, enableBlurShield, clearClipboard, showSecurityWarning]);

  return {
    isPrtScnTriggered: isExempt ? false : isPrtScnTriggered,
    isWindowBlurred: isExempt ? false : isWindowBlurred,
    warningMessage: isExempt ? null : warningMessage,
    isExempt,
    clearWarning: () => setWarningMessage(null)
  };
};
