import React, { useRef, useEffect } from 'react';

/**
 * Reusable 6-digit OTP input component
 * Supports auto-focus, paste, backspace, left/right arrow navigation
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

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}>
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
          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono rounded-2xl border transition-all duration-200 outline-none
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
    </div>
  );
};
