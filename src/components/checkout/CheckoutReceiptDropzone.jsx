import React from 'react';
import { FileCheck, UploadCloud, ShieldCheck, Loader2 } from 'lucide-react';

export const CheckoutReceiptDropzone = ({
  selectedFile,
  filePreview,
  handleFileChange,
  handleUploadReceipt,
  submitting,
  isStarted,
  timeLeft
}) => {
  return (
    <div className="p-3 sm:p-3.5 rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-brand-500" />
          <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            3. To'lov Chekini Yuklash
          </h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rasm yoki PDF format</span>
      </div>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-3.5 sm:p-4 text-center transition-colors relative cursor-pointer bg-gray-50/60 dark:bg-white/[0.01]">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {selectedFile ? (
          <div className="flex items-center justify-center space-x-3">
            {filePreview ? (
              <img
                src={filePreview}
                alt="Chek preview"
                className="w-12 h-12 object-cover rounded-xl border border-gray-200 dark:border-white/10 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
            )}
            <div className="text-left">
              <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold mt-0.5">
                Boshqa fayl tanlash uchun bosing
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3 py-1.5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">
                Chek suratini bu yerga tashlang yoki tanlang
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                PNG, JPG, JPEG yoki PDF (maksimal hajm 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleUploadReceipt}
        disabled={submitting || !selectedFile || (!isStarted && timeLeft <= 0)}
        className="w-full py-3 sm:py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
        <span>Sotib Olish / Chekni Adminga Yuborish</span>
      </button>
    </div>
  );
};
