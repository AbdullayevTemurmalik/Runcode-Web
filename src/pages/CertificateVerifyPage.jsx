import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Calendar, 
  BookOpen, 
  AlertCircle, 
  ArrowLeft,
  Loader2,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

export const CertificateVerifyPage = () => {
  const { certificateNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const verify = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/certificates/verify/${certificateNumber}`);
        if (!isCancelled) {
          if (res.success && res.certificate) {
            setData(res.certificate);
          } else {
            setError(res.message || 'Sertifikat topilmadi.');
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err.response?.data?.message || 
            'Ushbu raqamdagi sertifikat tizimdan topilmadi yoki soxta bo\'lishi mumkin.'
          );
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    if (certificateNumber) {
      verify();
    } else {
      setLoading(false);
      setError('Sertifikat raqami kiritilmagan.');
    }

    return () => {
      isCancelled = true;
    };
  }, [certificateNumber]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gray-50 dark:bg-[#070b14]">
      <div className="w-full max-w-xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RunCode Bosh Sahifasi</span>
          </Link>
          <span className="text-xs font-mono text-gray-400 dark:text-gray-600">
            ID: {certificateNumber || '—'}
          </span>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-[#0c101c] rounded-3xl p-12 border border-gray-200 dark:border-white/10 shadow-xl text-center space-y-4">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Sertifikat haqiqiyligi tekshirilmoqda...
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              RunCode.uz markaziy bazasi orqali raqam va elektron imzo solishtirilmoqda.
            </p>
          </div>
        ) : error || !data ? (
          <div className="bg-white dark:bg-[#0c101c] rounded-3xl p-8 sm:p-10 border border-rose-200 dark:border-rose-950/60 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                Tasdiqlanmadi
              </span>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-3">
                Sertifikat Haqiqiy Emas
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                {error}
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/courses"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
              >
                <span>Kurslarni Ko'rish</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0c101c] rounded-3xl p-8 sm:p-10 border border-emerald-200 dark:border-emerald-950/60 shadow-xl space-y-6 animate-in fade-in">
            {/* Header Status */}
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Rasman Tasdiqlangan Sertifikat
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  RunCode.uz elektron ta'lim platformasi tomonidan berilgan
                </p>
              </div>
            </div>

            {/* Student & Course Details */}
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Talaba
                </p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {data.studentName}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-4 h-4 text-brand-500" />
                    <span>Kurs Nomi</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {data.courseName}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Imtihon Natijasi</span>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {data.score}% (A'lo)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-brand-500" />
                    <span>Berilgan Sana</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatDate(data.issuedAt)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Holati</span>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Faol va Yaroqli
                  </p>
                </div>
              </div>

              {/* QR Code section */}
              {data.qrCodeDataUrl && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      Elektron Tekshiruv Kodingi
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Ushbu QR kod orqali istalgan shaxs sertifikatni 24/7 onlayn tekshirishi mumkin.
                    </p>
                  </div>
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 shrink-0">
                    <img 
                      src={data.qrCodeDataUrl} 
                      alt="Sertifikat QR Kodi" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 dark:border-white/5">
              <span className="text-[11px] font-mono text-gray-400">
                № {data.certificateNumber}
              </span>
              <Link
                to="/courses"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Kurslarga O'tish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerifyPage;
