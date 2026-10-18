import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, ClipboardPaste } from 'lucide-react';

/**
 * Reusable 6-digit OTP input component
 * Supports auto-focus, paste, backspace, left/right arrow navigation,
 * and 1-click clipboard paste / copy action next to the code.
 */
export const OtpInput = ({
  value = '',
  onChange,
  length = 6,
  disabled = false,
  isError = false,
  autoFocus = true,
  className = ''
}) => {
  const inputRefs = useRef([]);
  const [copied, setCopied] = useState(false);
  const [justPasted, setJustPasted] = useState(false);

  // Ensure digits array matches length
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (e, index) => {
    const rawVal = e.target.value;
    const digit = rawVal.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    const newCode = newDigits.join('');

    onChange?.(newCode);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous box and clear it
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange?.(newDigits.join(''));
        e.preventDefault();
      } else if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange?.(newDigits.join(''));
        e.preventDefault();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    onChange?.(pasted);

    const targetIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[targetIndex]?.focus();
  };

  const handleCopyCode = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleanDigits = text.replace(/\D/g, '').slice(0, length);
      if (cleanDigits) {
        onChange?.(cleanDigits);
        setJustPasted(true);
        setTimeout(() => setJustPasted(false), 1500);
        const targetIndex = Math.min(cleanDigits.length, length - 1);
        inputRefs.current[targetIndex]?.focus();
      }
    } catch {
      // Clipboard API might be restricted by browser permissions
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete="one-time-code"
            value={digits[idx] || ''}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            disabled={disabled}
            aria-label={`Digit ${idx + 1}`}
            className={`w-10 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono rounded-2xl border transition-all duration-200 outline-none
              ${
                isError
                  ? 'border-rose-500 bg-rose-50/20 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20'
                  : digits[idx]
                  ? 'border-brand-500 bg-brand-500/5 text-gray-900 dark:text-white ring-2 ring-brand-500/20'
                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#12131a] text-gray-900 dark:text-white hover:border-brand-500/40 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-white/5' : ''}
            `}
          />
        ))}

        {/* 1-Click Clipboard Action Icon next to OTP boxes */}
        <button
          type="button"
          onClick={value ? handleCopyCode : handlePasteFromClipboard}
          disabled={disabled}
          title={value ? "Kodni nusxalash" : "Xotiradan qo'yish"}
          className={`w-10 h-13 sm:w-12 sm:h-14 flex items-center justify-center rounded-2xl border transition-all duration-200 cursor-pointer ${
            copied
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-2 ring-emerald-500/20'
              : justPasted
              ? 'border-brand-500 bg-brand-500/10 text-brand-500 ring-2 ring-brand-500/20'
              : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#12131a] text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 hover:border-brand-500/40'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {copied ? (
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
          ) : value ? (
            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <ClipboardPaste className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* Action Helper Bar */}
      <div className="flex items-center justify-center gap-3 text-[11px] font-medium text-gray-400 dark:text-gray-500">
        <button
          type="button"
          onClick={handlePasteFromClipboard}
          disabled={disabled}
          className="inline-flex items-center gap-1 hover:text-brand-500 transition-colors cursor-pointer"
        >
          {justPasted ? <Check className="w-3 h-3 text-emerald-500" /> : <ClipboardPaste className="w-3 h-3" />}
          <span>{justPasted ? "Qo'yildi" : "Xotiradan qo'yish"}</span>
        </button>

        {value && (
          <>
            <span>&bull;</span>
            <button
              type="button"
              onClick={handleCopyCode}
              disabled={disabled}
              className="inline-flex items-center gap-1 hover:text-brand-500 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Nusxalandi" : "Nusxalash"}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
