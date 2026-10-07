import React, { useState } from 'react';
import { Copy, Check, Terminal, Sparkles, BookOpen } from 'lucide-react';

export const MarkdownViewer = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!content) return null;

  const copyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Har qanday emojini tozalash (foydalanuvchi talabi: hech qanday emoji bo'lmasin)
  const stripEmojis = (str) => {
    return str.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '').trim();
  };

  // Matn ichidagi **qalin**, `kod` elementlarini to'g'ri render qilish
  const parseInline = (text) => {
    const cleaned = stripEmojis(text);
    // Split by **bold** and `code`
    const parts = cleaned.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={idx} className="font-bold text-gray-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={idx} className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-brand-600 dark:text-brand-400 font-mono text-xs">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Markdown parsing (headings, code blocks, paragraphs, lists)
  const renderFormattedContent = () => {
    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let codeLang = '';
    let codeBlockCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block start/end
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang = line.trim().replace('```', '') || 'code';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const codeText = codeBuffer.join('\n');
          const currentIndex = codeBlockCount++;

          elements.push(
            <div key={`code-${currentIndex}`} className="my-6 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md max-w-full">
              <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-brand-500" />
                  <span className="text-xs font-mono font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    {codeLang}
                  </span>
                </div>
                <button
                  onClick={() => copyCode(codeText, currentIndex)}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-brand-500 transition-colors"
                >
                  {copiedIndex === currentIndex ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Nusxalandi</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nusxa olish</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed max-w-full">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Sarlavhalar (emoji o'rniga zamonaviy Lucide ikonka bilan)
      if (line.startsWith('# ')) {
        const titleText = stripEmojis(line.replace('# ', ''));
        elements.push(
          <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-8 mb-4 tracking-tight flex items-center">
            <BookOpen className="w-6 h-6 text-brand-500 mr-2 flex-shrink-0 inline" />
            <span>{titleText}</span>
          </h1>
        );
      } else if (line.startsWith('## ')) {
        const titleText = stripEmojis(line.replace('## ', ''));
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-3 flex items-center tracking-tight border-b border-gray-100 dark:border-gray-800 pb-2">
            <Sparkles className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0 inline" />
            <span>{titleText}</span>
          </h2>
        );
      } else if (line.startsWith('### ')) {
        const titleText = stripEmojis(line.replace('### ', ''));
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-6 mb-2">
            {titleText}
          </h3>
        );
      } else if (line.startsWith('---')) {
        elements.push(
          <hr key={`hr-${i}`} className="my-8 border-gray-200 dark:border-gray-800" />
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={`li-${i}`} className="ml-4 list-disc text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed my-1">
            {parseInline(line.substring(2))}
          </li>
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${i}`} className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed my-3">
            {parseInline(line)}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className="prose dark:prose-invert max-w-none min-w-0">
      {renderFormattedContent()}
    </div>
  );
};
