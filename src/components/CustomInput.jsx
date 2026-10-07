import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const CustomInput = ({
  label,
  sublabel,
  icon: Icon,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = null,
  isPassword = false,
  isPhone = false,
  className = '',
  inputClassName = '',
  size = 'md',
  min,
  max,
  minLength,
  maxLength,
  autoComplete,
  id,
  name
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Phone number formatter: +998 90 123 45 67
  const handlePhoneInputChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }

    const digitsOnly = val.replace(/\D/g, ''); // 998...
    const localDigits = digitsOnly.substring(3); // 901234567

    let formatted = '+998 ';
    if (localDigits.length > 0) {
      formatted += localDigits.substring(0, 2);
    }
    if (localDigits.length > 2) {
      formatted += ' ' + localDigits.substring(2, 5);
    }
    if (localDigits.length > 5) {
      formatted += ' ' + localDigits.substring(5, 7);
    }
    if (localDigits.length > 7) {
      formatted += ' ' + localDigits.substring(7, 9);
    }

    onChange({
      target: {
        value: formatted,
        name
      }
    });
  };

  const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const sizeClasses = {
    sm: 'py-2 px-3 text-xs rounded-xl',
    md: 'py-2.5 px-3.5 text-xs sm:text-sm rounded-xl',
    lg: 'py-3.5 px-4 text-sm sm:text-base rounded-2xl'
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label & Sublabel */}
      {(label || sublabel) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={id}
              className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center"
            >
              <span>{label}</span>
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}
          {sublabel && (
            <span className="text-[10px] text-gray-400 font-medium">
              {sublabel}
            </span>
          )}
        </div>
      )}

      {/* Input Wrapper */}
      <div
        className={`relative flex items-center transition-all duration-200 rounded-xl border ${
          error
            ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/10'
            : 'border-gray-200 dark:border-white/10 hover:border-brand-500/40 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20'
        } ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-white/5'
            : 'bg-white dark:bg-[#0c0d12]/90'
        }`}
      >
        {/* Left Icon or Phone Prefix */}
        {Icon && (
          <div className="pl-3.5 pr-1 flex items-center pointer-events-none text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {/* Real Input */}
        <input
          id={id}
          name={name}
          type={actualType}
          value={value}
          onChange={isPhone ? handlePhoneInputChange : onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all ${
            sizeClasses[size] || sizeClasses.md
          } ${Icon ? 'pl-2' : ''} ${isPassword ? 'pr-10' : ''} ${inputClassName}`}
        />

        {/* Right Action: Password Eye Toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer rounded-lg"
            aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-brand-500" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-1.5 text-rose-500 text-[11px] font-medium pt-0.5 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
