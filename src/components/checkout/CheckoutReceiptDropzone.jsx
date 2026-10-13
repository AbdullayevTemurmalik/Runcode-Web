import React from 'react';
import { FileCheck, UploadCloud, ShieldCheck, Loader2, Trash2, CheckCircle2 } from 'lucide-react';

export const CheckoutReceiptDropzone = ({
  selectedFile,
  filePreview,
  handleFileChange,
  handleRemoveFile,
  handleUploadReceipt,
  submitting,
  isStarted,
  timeLeft
}) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            3. To'lov Chekini Yuklash
          </h3>
        </div>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">PNG, JPG, PDF (maks 10MB)</span>
      </div>

      <div className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center transition-all relative ${
        selectedFile 
          ? 'border-emerald-500/60 bg-emerald-500/5 dark:bg-emerald-500/10' 
          : 'border-gray-300 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 bg-gray-50/60 dark:bg-white/[0.01]'
      }`}>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title="Chek faylini tanlash"
        />

        {selectedFile ? (
          <div className="flex items-center justify-between gap-2.5 relative z-20">
            <div className="flex items-center space-x-2.5 min-w-0">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Chek preview"
                  className="w-12 h-12 object-cover rounded-xl border-2 border-emerald-500/40 shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                  <FileCheck className="w-6 h-6" />
                </div>
              )}
              <div className="text-left min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase">
                    <CheckCircle2 className="w-3 h-3 mr-0.5" />
                    Fayl tanlandi
                  </span>
                  {selectedFile.size && (
                    <span className="text-[9px] text-gray-400 font-mono">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white truncate mt-0.5">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold mt-0.5 pointer-events-none">
                  Boshqa fayl tanlash uchun bosing
                </p>
              </div>
            </div>

            {handleRemoveFile && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex-shrink-0 cursor-pointer"
                title="Faylni o'chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2.5 py-1.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0 border border-brand-500/20">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">
                Chek suratini bu yerga tashlang yoki bosing
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                PNG, JPG, JPEG yoki PDF (maksimal hajm 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 100% Katta Va Ko'zga Tashlanadigan Tasdiqlash Tugmasi */}
      {selectedFile ? (
        <button
          type="button"
          onClick={handleUploadReceipt}
          disabled={submitting || (!isStarted && timeLeft <= 0)}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] border-2 border-emerald-400/40"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Chek Adminga Yuborilmoqda...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>To'lov Chekini Adminga Yuborish (Tasdiqlash)</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          disabled={true}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-white/[0.04] text-gray-400 dark:text-gray-500 font-bold text-xs sm:text-sm uppercase tracking-wider border border-gray-200 dark:border-white/5 flex items-center justify-center space-x-2 cursor-not-allowed"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Avval to'lov chekini tanlang (tugma faollashadi)</span>
        </button>
      )}
    </div>
  );
};
