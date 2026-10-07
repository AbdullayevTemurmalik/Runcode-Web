import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Code2, 
  Eye, 
  Sparkles,
  Maximize2,
  Copy,
  Check
} from 'lucide-react';

export const CodePlayground = ({
  initialCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 24px;
      background: #0f172a;
      color: #f8fafc;
      text-align: center;
    }
    h1 {
      color: #38bdf8;
      margin-bottom: 8px;
    }
    p {
      color: #94a3b8;
      line-height: 1.6;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid rgba(56, 189, 248, 0.3);
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="badge">RunCode.uz Amaliy Mashq</div>
  <h1>Salom, Men Dasturchiman!</h1>
  <p>Ushbu kodni o'zgartiring va "Ishga Tushirish" tugmasini bosing.</p>
</body>
</html>`,
  taskTitle = "Amaliy Topshiriq",
  taskDescription = "Quyidagi muharrirda o'z ism-familiyangiz aks etgan <h1> sarlavha va dasturlash maqsadingiz haqida <p> matni yozing hamda kodni ishga tushiring.",
  validationRule = (code) => code.includes('<h1') && code.includes('<p'),
  onSuccess
}) => {
  const [code, setCode] = useState(initialCode);
  const [outputHtml, setOutputHtml] = useState(initialCode);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'preview', 'split'
  const [validationStatus, setValidationStatus] = useState(null); // null, 'success', 'error'
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    setOutputHtml(initialCode);
    setCode(initialCode);
    setValidationStatus(null);
  }, [initialCode]);

  const handleRunCode = () => {
    setOutputHtml(code);
    setValidationStatus(null);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutputHtml(initialCode);
    setValidationStatus(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidate = () => {
    const passed = validationRule ? validationRule(code) : true;
    if (passed) {
      setValidationStatus('success');
      if (onSuccess) onSuccess();
    } else {
      setValidationStatus('error');
    }
  };

  return (
    <div className="rounded-3xl bg-[#0f1422] border border-gray-800 shadow-2xl overflow-hidden my-8">
      
      {/* 1. Header with Task Info */}
      <div className="p-4 sm:p-6 border-b border-gray-800/80 bg-gray-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase tracking-wider flex items-center">
              <Terminal className="w-3 h-3 mr-1" /> Kodlash Maydoni
            </span>
            <h4 className="text-sm sm:text-base font-bold text-white">{taskTitle}</h4>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
            {taskDescription}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start md:self-center">
          <button
            type="button"
            onClick={handleRunCode}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Ishga Tushirish</span>
          </button>

          <button
            type="button"
            onClick={handleValidate}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tekshirish</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-gray-700 bg-gray-800/80 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Qayta tiklash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Validation Result Banner */}
      {validationStatus === 'success' && (
        <div className="px-6 py-3 bg-emerald-950/60 border-b border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Ajoyib natija! Siz topshiriq shartlarini to'g'ri bajardingiz. Darslikni davom ettirishingiz mumkin.</span>
        </div>
      )}
      {validationStatus === 'error' && (
        <div className="px-6 py-3 bg-rose-950/60 border-b border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>Vazifada kamchilik bor. Iltimos, shartda ko'rsatilgan barcha teglarni to'g'ri yozganingizga ishonch hosil qiling.</span>
        </div>
      )}

      {/* 2. Workspace: Editor (Left) & Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
        
        {/* Editor Pane */}
        <div className="flex flex-col bg-[#0b0f19]">
          <div className="px-4 py-2 border-b border-gray-800/60 bg-gray-900/40 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <Code2 className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-mono text-[11px] font-semibold text-gray-300">index.html</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Nusxalandi' : 'Nusxalash'}</span>
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                setCode(code.substring(0, start) + '  ' + code.substring(end));
                setTimeout(() => {
                  e.target.selectionStart = e.target.selectionEnd = start + 2;
                }, 0);
              }
            }}
            spellCheck={false}
            className="w-full h-80 sm:h-96 p-4 bg-transparent font-mono text-xs sm:text-sm text-gray-200 resize-none focus:outline-none leading-relaxed selection:bg-brand-500/30"
            placeholder="Kodingizni shu yerga yozing..."
          />
        </div>

        {/* Live Preview Pane */}
        <div className="flex flex-col bg-white dark:bg-[#060911]">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800/60 bg-gray-100 dark:bg-gray-900/40 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Jonli Natija (Live Preview)</span>
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Iframe Sandbox</span>
          </div>

          <iframe
            ref={iframeRef}
            srcDoc={outputHtml}
            title="Code Preview"
            sandbox="allow-scripts"
            className="w-full h-80 sm:h-96 border-0 bg-white"
          />
        </div>

      </div>

      {/* 3. Footer Bar */}
      <div className="px-4 py-3 bg-gray-900/60 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500">
        <span>Xavfsiz Web Sandbox muhiti</span>
        <span>HTML5, CSS3, JavaScript qo'llab-quvvatlanadi</span>
      </div>

    </div>
  );
};
