import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Pencil, 
  Check, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { CustomInput } from '../CustomInput';
import { CustomDatePicker } from '../CustomDatePicker';

export const DashboardProfileForm = ({
  user,
  isEditing,
  handleStartEdit,
  handleCancelEdit,
  handleSaveProfile,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  birthDate,
  setBirthDate,
  email,
  setEmail,
  saveLoading,
  saveSuccess,
  saveError,
  hasSubscription,
  tierInfo,
  daysLeft
}) => {
  const TierIcon = tierInfo.icon;

  return (
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
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-xs transition-colors shadow-sm cursor-pointer"
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
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bekor qilish</span>
            </button>

            <button
              type="submit"
              disabled={saveLoading}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 cursor-pointer"
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
  );
};
