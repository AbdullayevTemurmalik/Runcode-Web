// RunCode.uz - 4 ta Asosiy Kurs (HTML, CSS, JavaScript, React) uchun
// 4 ta Modulga ajratish, Oraliq Testlar (10 ta savol) va Yakuniy Imtihon (20 ta savol)

export const COURSE_MODULE_CONFIGS = {
  html: {
    title: 'HTML Dasturlash Asoslari',
    modules: [
      {
        id: 'mod-1',
        index: 1,
        title: '1-Modul: HTML Kirish va Asosiy Tuzilma',
        description: 'Kompyuter, Editor, Brauzer, HTML tuzilishi va asosiy teglar',
        lessonIndices: [0, 1, 2], // 1-3 darslar
      },
      {
        id: 'mod-2',
        index: 2,
        title: '2-Modul: Strukturaviy Elementlar, Media va Havolalar',
        description: 'Blok va satr elementlar, rasm, video, audio va web navigatsiya',
        lessonIndices: [3, 4, 5], // 4-6 darslar
      },
      {
        id: 'mod-3',
        index: 3,
        title: '3-Modul: Ro\'yxatlar, Jadvallar va Interaktiv Formlar',
        description: 'Tartibli/tartibsiz ro\'yxatlar, jadvallar va foydalanuvchi inputlari',
        lessonIndices: [6, 7, 8], // 7-9 darslar
      },
      {
        id: 'mod-4',
        index: 4,
        title: '4-Modul: HTML Best Practices, SEO va Semantika',
        description: 'Semantik web standartlari, qidiruv tizimlari (SEO) va yakuniy amaliyot',
        lessonIndices: [9, 10], // 10-11 darslar
      }
    ]
  },
  css: {
    title: 'CSS va Zamonaviy Dizayn',
    modules: [
      {
        id: 'mod-1',
        index: 1,
        title: '1-Modul: CSS Asoslari, Selektorlar va Box Model',
        description: 'CSS sintaksisi, selektorlar ustunligi (specificity), BEM, Box model va matn stillari',
        lessonIndices: [0, 1, 2, 3, 4], // 1-5 darslar
      },
      {
        id: 'mod-2',
        index: 2,
        title: '2-Modul: Flexbox Joylashuvi, Position va Git Asoslari',
        description: 'Flex container, elementlarni tekislash, position turlari va jamoaviy Git',
        lessonIndices: [5, 6, 7, 8, 9], // 6-10 darslar
      },
      {
        id: 'mod-3',
        index: 3,
        title: '3-Modul: Background, Transform, Transition va Animatsiyalar',
        description: 'Fonlar, o\'lchov birliklari (rem/em/px), 2D/3D transform, silliq o\'tishlar va @keyframes',
        lessonIndices: [10, 11, 12, 13, 14], // 11-15 darslar
      },
      {
        id: 'mod-4',
        index: 4,
        title: '4-Modul: CSS Grid, Media Queries, Tailwind va SCSS',
        description: 'Grid layout, responsiv dizayn, zamonaviy CSS freymvorklari va preprotsessorlar',
        lessonIndices: [15, 16, 17, 18], // 16-19 darslar
      }
    ]
  },
  javascript: {
    title: 'JavaScript To\'liq Kurs',
    modules: [
      {
        id: 'mod-1',
        index: 1,
        title: '1-Modul: JS Asoslari, Tiplar, Operatorlar va Sikllar',
        description: 'O\'zgaruvchilar, ma\'lumot turlari, shart operatorlari, sikllar va funksiyalar',
        lessonIndices: [0, 1, 2, 3, 4, 5, 6], // 1-7 darslar
      },
      {
        id: 'mod-2',
        index: 2,
        title: '2-Modul: String, Math, Obyektlar va Array Metodlari',
        description: 'String & Math metodlari, murakkab obyektlar va massivlar bilan ishlash',
        lessonIndices: [7, 8, 9, 10, 11, 12, 13], // 8-14 darslar
      },
      {
        id: 'mod-3',
        index: 3,
        title: '3-Modul: DOM Manipulyatsiyasi, Hodisalar va Web Storage',
        description: 'DOM daraxti, hodisalarni ushlash, ToDo loyihasi, LocalStorage va Date obyekti',
        lessonIndices: [14, 15, 16, 17, 18, 19, 20], // 15-21 darslar
      },
      {
        id: 'mod-4',
        index: 4,
        title: '4-Modul: Asinxron JS, Promises, Async/Await, OOP va Event Loop',
        description: 'Promise, Fetch API, CRUD amallari, Closure, OOP va JavaScript dvigatelining ishlashi',
        lessonIndices: [21, 22, 23, 24, 25, 26, 27], // 22-28 darslar
      }
    ]
  },
  react: {
    title: 'React.js Ekotizimi',
    modules: [
      {
        id: 'mod-1',
        index: 1,
        title: '1-Modul: Reactga Kirish, JSX va Komponentlar',
        description: 'Virtual DOM, JSX qoidalari, komponent arxitekturasi va statik ro\'yxatlar',
        lessonIndices: [0, 1, 2, 3], // 1-4 darslar
      },
      {
        id: 'mod-2',
        index: 2,
        title: '2-Modul: Props, useState Hook va Interaktiv Hodisalar',
        description: 'Props orqali ma\'lumot uzatish, komponent holati (state) va eventlar',
        lessonIndices: [4, 5, 6], // 5-7 darslar
      },
      {
        id: 'mod-3',
        index: 3,
        title: '3-Modul: useEffect, Server So\'rovlari (Fetch & Axios) va CRUD',
        description: 'Yon ta\'sirlar (side effects), API integratsiyasi va to\'liq CRUD operatsiyalari',
        lessonIndices: [7, 8, 9], // 8-10 darslar
      },
      {
        id: 'mod-4',
        index: 4,
        title: '4-Modul: React Router DOM, Context API va Xotira Optimizatsiyasi',
        description: 'Ko\'p sahifali SPA marshrutlash, global holat boshqaruvi va unumdorlik',
        lessonIndices: [10, 11, 12, 13, 14], // 11-15 darslar
      }
    ]
  }
};

// Darslarni 4 ta modulga taqsimlovchi yordamchi funksiya
export const splitLessonsInto4Modules = (lessons = [], courseSlug = 'html') => {
  if (!lessons || lessons.length === 0) return [];
  const config = COURSE_MODULE_CONFIGS[courseSlug?.toLowerCase()];
  
  if (config) {
    return config.modules.map((m) => {
      const moduleLessons = m.lessonIndices
        .map(idx => lessons[idx])
        .filter(Boolean);

      const isCompleted = moduleLessons.length > 0 && moduleLessons.every(l => l.is_completed);
      const completedCount = moduleLessons.filter(l => l.is_completed).length;

      return {
        id: m.id,
        index: m.index,
        title: m.title,
        description: m.description,
        lessons: moduleLessons,
        isCompleted,
        completedCount
      };
    });
  }

  // Agar boshqa kurs bo'lsa, teng 4 qismga bo'lamiz
  const count = lessons.length;
  const chunkSize = Math.ceil(count / 4);
  const result = [];

  for (let i = 0; i < 4; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, count);
    const chunk = lessons.slice(start, end);
    if (chunk.length > 0) {
      result.push({
        id: `mod-${i + 1}`,
        index: i + 1,
        title: `${i + 1}-Modul`,
        description: `${i + 1}-bosqich darslari`,
        lessons: chunk,
        isCompleted: chunk.every(l => l.is_completed),
        completedCount: chunk.filter(l => l.is_completed).length
      });
    }
  }

  return result;
};

// ==========================================
// ORALIQ MODUL TESTLARI (Har biri 10 ta savol)
// 1 -> 2: 1-modul mavzulari (10 savol)
// 2 -> 3: 1 va 2-modul mavzulari (10 savol)
// 3 -> 4: 1, 2 va 3-modul mavzulari (10 savol)
// ==========================================

export const MODULE_INTERIM_QUIZZES = {
  // ---------------- HTML ----------------
  html: {
    1: {
      title: '1-Modul Oraliq Testi (2-Modulga O\'tish)',
      scopeText: '1-Modulda o\'tilgan mavzular bo\'yicha (HTML Kirish, Tuzilma, Teglar va Atributlar)',
      passingScore: 70,
      targetModuleIndex: 2,
      questions: [
        {
          id: 101,
          question: 'HTML qisqartmasining to\'liq ma\'nosi qaysi javobda to\'g\'ri ko\'rsatilgan?',
          options: ['HyperText Markup Language', 'High Tech Modern Language', 'Hyperlink Text Management List', 'Home Tool Markup Language'],
          correctOption: 0
        },
        {
          id: 102,
          question: 'HTML hujjatini HTML5 standartida ekanligini brauzerga bildiruvchi deklaratsiya qaysi?',
          options: ['<html version="5">', '<!DOCTYPE html>', '<doctype:html5>', '<head doctype="html">'],
          correctOption: 1
        },
        {
          id: 103,
          question: 'Web sahifaning foydalanuvchiga ko\'rinadigan barcha asosiy tarkibi qaysi teg ichida yoziladi?',
          options: ['<head>', '<meta>', '<body>', '<title>'],
          correctOption: 2
        },
        {
          id: 104,
          question: 'Brauzer tabida (tepa qismida) sahifa sarlavhasini ko\'rsatish uchun qaysi teg ishlatiladi?',
          options: ['<header>', '<title>', '<h1>', '<caption>'],
          correctOption: 1
        },
        {
          id: 105,
          question: 'HTMLda eng katta darajadagi asosiy sarlavha tegi qaysi?',
          options: ['<h6>', '<head>', '<header>', '<h1>'],
          correctOption: 3
        },
        {
          id: 106,
          question: 'Yangi xatboshi (paragraf) yaratish uchun qaysi teg qo\'llaniladi?',
          options: ['<p>', '<para>', '<text>', '<line>'],
          correctOption: 0
        },
        {
          id: 107,
          question: 'Matnni yangi qatorga tushirish uchun qaysi toq (self-closing) teg ishlatiladi?',
          options: ['<hr>', '<br>', '<p>', '<enter>'],
          correctOption: 1
        },
        {
          id: 108,
          question: 'Gorizontal ajratuvchi chiziq tortish uchun qaysi teg ishlatiladi?',
          options: ['<line>', '<border>', '<hr>', '<divider>'],
          correctOption: 2
        },
        {
          id: 109,
          question: 'Teglarga qo\'shimcha xususiyat yoki ma\'lumot beruvchi kalit-qiymat juftligi nima deyiladi?',
          options: ['Parametr', 'Atribut (Attribute)', 'CSS Stillari', 'Funksiya'],
          correctOption: 1
        },
        {
          id: 110,
          question: 'HTML fayllari kompyuterda qaysi kengaytma bilan saqlanishi kerak?',
          options: ['.htm yoki .html', '.doc yoki .docx', '.txt yoki .web', '.code'],
          correctOption: 0
        }
      ]
    },
    2: {
      title: '2-Modul Oraliq Testi (3-Modulga O\'tish)',
      scopeText: '1 va 2-Modullarda o\'tilgan mavzular bo\'yicha (Media, Havolalar, Blok/Satr elementlar va Asoslar)',
      passingScore: 70,
      targetModuleIndex: 3,
      questions: [
        {
          id: 111,
          question: 'Web sahifaga rasm joylashtirish uchun qaysi teg ishlatiladi?',
          options: ['<image>', '<picture>', '<img src="...">', '<photo>'],
          correctOption: 2
        },
        {
          id: 112,
          question: '<img> tegida rasm yuklanmay qolganda uning o\'rniga chiqadigan tavsif matni qaysi atributda beriladi?',
          options: ['title', 'alt', 'caption', 'desc'],
          correctOption: 1
        },
        {
          id: 113,
          question: 'Boshqa sahifaga o\'tish uchun havola (link) yaratuvchi teg qaysi?',
          options: ['<link>', '<href>', '<a>', '<nav>'],
          correctOption: 2
        },
        {
          id: 114,
          question: 'Havola bosilganda yangi brauzer oynasi (tab) da ochilishi uchun qaysi atribut beriladi?',
          options: ['target="_blank"', 'window="new"', 'open="tab"', 'rel="external"'],
          correctOption: 0
        },
        {
          id: 115,
          question: 'Qaysi element to\'liq qatorni egallovchi Blokli (Block-level) element hisoblanadi?',
          options: ['<span>', '<a>', '<div>', '<b>'],
          correctOption: 2
        },
        {
          id: 116,
          question: 'Qaysi element faqat o\'z tarkibicha joy egallovchi Satrli (Inline) element hisoblanadi?',
          options: ['<div>', '<p>', '<span>', '<h1>'],
          correctOption: 2
        },
        {
          id: 117,
          question: 'Web sahifada audio fayllarni ijro etish uchun HTML5 da qaysi teg kiritilgan?',
          options: ['<sound>', '<music>', '<audio>', '<mp3>'],
          correctOption: 2
        },
        {
          id: 118,
          question: 'Video faylni boshqarish tugmalari (play, pause, ovoz) ko\'rinishi uchun <video> tegiga qaysi atribut qo\'shiladi?',
          options: ['controls', 'autoplay', 'play-btn', 'panel'],
          correctOption: 0
        },
        {
          id: 119,
          question: 'Sayt navigatsiya havolalarini guruhlash uchun qaysi semantik teg ishlatiladi?',
          options: ['<menu>', '<nav>', '<navigation>', '<header>'],
          correctOption: 1
        },
        {
          id: 120,
          question: 'HTMLda bo\'sh joy (space) qoldirish uchun qaysi maxsus entity belgisi ishlatiladi?',
          options: ['&space;', '&nbsp;', '&blank;', '&gap;'],
          correctOption: 1
        }
      ]
    },
    3: {
      title: '3-Modul Oraliq Testi (4-Modulga O\'tish)',
      scopeText: '1, 2 va 3-Modullarda o\'tilgan mavzular bo\'yicha (Ro\'yxatlar, Jadvallar, Formlar, Media va Asoslar)',
      passingScore: 70,
      targetModuleIndex: 4,
      questions: [
        {
          id: 121,
          question: 'Raqamlangan (tartiblangan) ro\'yxat yaratish uchun qaysi teg ishlatiladi?',
          options: ['<ul>', '<ol>', '<dl>', '<list>'],
          correctOption: 1
        },
        {
          id: 122,
          question: 'Markerli (nuqtali, tartiblanmagan) ro\'yxat yaratish tegi qaysi?',
          options: ['<ul>', '<ol>', '<li>', '<menu>'],
          correctOption: 0
        },
        {
          id: 123,
          question: 'Ro\'yxatning har bir alohida bandi qaysi teg ichida yoziladi?',
          options: ['<item>', '<point>', '<li>', '<dd>'],
          correctOption: 2
        },
        {
          id: 124,
          question: 'Jadval qatorini (table row) yaratish uchun qaysi teg ishlatiladi?',
          options: ['<td>', '<th>', '<tr>', '<row>'],
          correctOption: 2
        },
        {
          id: 125,
          question: 'Jadval ichidagi oddiy ma\'lumot katakchasi qaysi teg bilan yoziladi?',
          options: ['<td>', '<th>', '<tc>', '<data>'],
          correctOption: 0
        },
        {
          id: 126,
          question: 'Foydalanuvchidan ma\'lumot kiritishni so\'rash uchun qaysi asosiy teg ishlatiladi?',
          options: ['<input-group>', '<form>', '<data-collector>', '<submit>'],
          correctOption: 1
        },
        {
          id: 127,
          question: 'Kiritilayotgan matn yashirin (yulduzcha yoki nuqta) bo\'lib ko\'rinishi uchun inputning qaysi turi ishlatiladi?',
          options: ['<input type="text">', '<input type="secret">', '<input type="password">', '<input type="hidden">'],
          correctOption: 2
        },
        {
          id: 128,
          question: 'Foydalanuvchiga bir nechta variantdan BIRINIGINA tanlash imkonini beruvchi input turi qaysi?',
          options: ['<input type="checkbox">', '<input type="radio">', '<input type="single">', '<input type="pick">'],
          correctOption: 1
        },
        {
          id: 129,
          question: 'Ko\'p qatorli matn (masalan, izoh yoki xabar) kiritish uchun qaysi teg ishlatiladi?',
          options: ['<input type="multiline">', '<textbox>', '<textarea>', '<comment>'],
          correctOption: 2
        },
        {
          id: 130,
          question: 'Ochiluvchi ro\'yxat (dropdown select) yaratish uchun qaysi teglar juftligi ishlatiladi?',
          options: ['<list> va <item>', '<select> va <option>', '<dropdown> va <value>', '<picker> va <choice>'],
          correctOption: 1
        }
      ]
    }
  },

  // ---------------- CSS ----------------
  css: {
    1: {
      title: '1-Modul Oraliq Testi (2-Modulga O\'tish)',
      scopeText: '1-Modulda o\'tilgan mavzular bo\'yicha (CSS Kirish, Selektorlar, Specificity, BEM, Box Model, Text va Display)',
      passingScore: 70,
      targetModuleIndex: 2,
      questions: [
        {
          id: 201,
          question: 'CSS qisqartmasining to\'liq ma\'nosi nima?',
          options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Styling Syntax', 'Colorful Sheet Structure'],
          correctOption: 1
        },
        {
          id: 202,
          question: 'CSS Box Model tarkibiga nimalar kiradi?',
          options: ['Content, Padding, Border, Margin', 'Header, Nav, Section, Footer', 'Width, Height, Top, Left', 'Color, Background, Font, Size'],
          correctOption: 0
        },
        {
          id: 203,
          question: 'Padding va Margin xususiyatlarining asosiy farqi nimada?',
          options: ['Padding tashqi masofa, Margin ichki masofa', 'Padding chegara ichidagi masofa, Margin chegara tashqarisidagi masofa', 'Hech qanday farqi yo\'q', 'Padding faqat matnlarga ta\'sir qiladi'],
          correctOption: 1
        },
        {
          id: 204,
          question: 'Qaysi CSS selektori eng yuqori ustunlikka (specificity) ega?',
          options: ['Element selektori (masalan: div)', 'Class selektori (masalan: .menu)', 'ID selektori (masalan: #header)', 'Universal selektor (*)'],
          correctOption: 2
        },
        {
          id: 205,
          question: 'BEM metodologiyasida "Element" qanday belgi bilan ajratiladi?',
          options: ['-- (ikkita tire)', '__ (ikkita pastki chiziq)', '-> (strelka)', ':: (ikkita nuqta)'],
          correctOption: 1
        },
        {
          id: 206,
          question: 'Elementni butunlay yashirish va joyini ham bo\'shatib berish uchun qaysi qoida yoziladi?',
          options: ['visibility: hidden;', 'opacity: 0;', 'display: none;', 'transform: scale(0);'],
          correctOption: 2
        },
        {
          id: 207,
          question: 'Elementning eniga padding va border qo\'shilganda uning umumiy eni oshib ketmasligi uchun nima yoziladi?',
          options: ['box-sizing: border-box;', 'box-sizing: content-box;', 'width: auto;', 'overflow: hidden;'],
          correctOption: 0
        },
        {
          id: 208,
          question: 'Matnni markazga tekislash uchun qaysi xususiyat ishlatiladi?',
          options: ['align-text: center;', 'text-align: center;', 'justify-text: center;', 'text-position: middle;'],
          correctOption: 1
        },
        {
          id: 209,
          question: 'Satrlar orasidagi vertikal masofani (qator balandligini) sozlash uchun qaysi xususiyat beriladi?',
          options: ['line-height', 'letter-spacing', 'word-spacing', 'line-gap'],
          correctOption: 0
        },
        {
          id: 210,
          question: 'HTML faylga tashqi CSS faylini ulash uchun <head> da qaysi teg yoziladi?',
          options: ['<script src="style.css">', '<style src="style.css">', '<link rel="stylesheet" href="style.css">', '<include css="style.css">'],
          correctOption: 2
        }
      ]
    },
    2: {
      title: '2-Modul Oraliq Testi (3-Modulga O\'tish)',
      scopeText: '1 va 2-Modullarda o\'tilgan mavzular bo\'yicha (Flexbox, Position, Z-Index, Git va Asoslar)',
      passingScore: 70,
      targetModuleIndex: 3,
      questions: [
        {
          id: 211,
          question: 'Flexboxda asosiy o\'q (main axis) bo\'yicha elementlarni markazlashtirish xususiyati qaysi?',
          options: ['align-items: center;', 'justify-content: center;', 'place-items: center;', 'text-align: center;'],
          correctOption: 1
        },
        {
          id: 212,
          question: 'Flexboxda kesishgan o\'q (cross axis) bo\'yicha elementlarni tekislash xususiyati qaysi?',
          options: ['align-items: center;', 'justify-content: center;', 'flex-direction: center;', 'align-content: middle;'],
          correctOption: 0
        },
        {
          id: 213,
          question: 'Flexbox elementlarini qator emas, ustun ko\'rinishida joylashtirish uchun nima yoziladi?',
          options: ['flex-direction: column;', 'flex-flow: row-reverse;', 'display: column;', 'flex-orientation: vertical;'],
          correctOption: 0
        },
        {
          id: 214,
          question: 'Elementni eng yaqin nisbiy (relative) ota elementiga bog\'lab joylashtirish uchun qaysi position beriladi?',
          options: ['position: static;', 'position: absolute;', 'position: fixed;', 'position: sticky;'],
          correctOption: 1
        },
        {
          id: 215,
          question: 'Brauzer oynasi aylantirilganda (scroll) ham o\'z joyida harakatsiz qotib turishi uchun qaysi position beriladi?',
          options: ['position: fixed;', 'position: relative;', 'position: absolute;', 'position: default;'],
          correctOption: 0
        },
        {
          id: 216,
          question: 'Ustma-ust tushgan elementlarning qaysi biri tepada ko\'rinishini boshqarish qaysi xususiyat orqali qilinadi?',
          options: ['layer-order', 'depth', 'z-index', 'stack-level'],
          correctOption: 2
        },
        {
          id: 217,
          question: 'Flex container ichidagi elementlar sig\'may qolsa keyingi qatorga o\'tishi uchun qaysi xususiyat beriladi?',
          options: ['flex-wrap: wrap;', 'flex-flow: auto;', 'overflow: wrap;', 'flex-break: next;'],
          correctOption: 0
        },
        {
          id: 218,
          question: 'Gitda fayllarning o\'zgarish holatini ko\'rish uchun qaysi buyruq beriladi?',
          options: ['git log', 'git status', 'git check', 'git diff-all'],
          correctOption: 1
        },
        {
          id: 219,
          question: 'Gitda barcha o\'zgargan fayllarni saqlashga (staging) tayyorlash buyrug\'i qaysi?',
          options: ['git add .', 'git commit .', 'git push .', 'git save -a'],
          correctOption: 0
        },
        {
          id: 220,
          question: 'Elementning shaffoflik darajasini 50% qilish uchun qaysi qoida to\'g\'ri?',
          options: ['transparency: 50%;', 'opacity: 0.5;', 'filter: alpha(50);', 'visibility: 0.5;'],
          correctOption: 1
        }
      ]
    },
    3: {
      title: '3-Modul Oraliq Testi (4-Modulga O\'tish)',
      scopeText: '1, 2 va 3-Modullarda o\'tilgan mavzular bo\'yicha (Background, O\'lchovlar, Transform, Animatsiya, Flexbox va Asoslar)',
      passingScore: 70,
      targetModuleIndex: 4,
      questions: [
        {
          id: 221,
          question: 'Elementni o\'z o\'qi atrofida 45 gradusga burish uchun qaysi CSS qoidasi yoziladi?',
          options: ['rotate: 45;', 'transform: rotate(45deg);', 'transition: turn(45);', 'animation: spin-45;'],
          correctOption: 1
        },
        {
          id: 222,
          question: 'Hover holatida stillar birdaniga emas, silliq (masalan, 0.3 soniyada) o\'zgarishi uchun nima yoziladi?',
          options: ['transition: all 0.3s ease;', 'transform: smooth 0.3s;', 'delay: 300ms;', 'animation-step: 0.3s;'],
          correctOption: 0
        },
        {
          id: 223,
          question: 'CSSda maxsus qayta takrorlanuvchi animatsiyalar yaratish direktivasi qaysi?',
          options: ['@animation', '@keyframes', '@motion', '@transition-frames'],
          correctOption: 1
        },
        {
          id: 224,
          question: '`rem` o\'lchov birligi nimaga nisbatan hisoblanadi?',
          options: ['Ota elementning shrift o\'lchamiga', 'Ildiz (html / root) elementning shrift o\'lchamiga', 'Brauzer oynasi eniga', 'Eng yaqin div konteyneriga'],
          correctOption: 1
        },
        {
          id: 225,
          question: '`vh` o\'lchov birligi nimani anglatadi?',
          options: ['Virtual Height', 'Viewport Height (Brauzer ko\'rish oynasi balandligining 1%)', 'Variable Header', 'Vertical Horizon'],
          correctOption: 1
        },
        {
          id: 226,
          question: 'Fon rasmining butun elementni to\'liq qoplab turishi (cho\'zilmasdan kesilishi) uchun nima beriladi?',
          options: ['background-size: cover;', 'background-size: contain;', 'background-repeat: full;', 'background-scale: 100%;'],
          correctOption: 0
        },
        {
          id: 227,
          question: 'Elementga soya (shadow) berish uchun qaysi xususiyat ishlatiladi?',
          options: ['element-shadow', 'box-shadow', 'drop-shadow', 'shadow-effect'],
          correctOption: 1
        },
        {
          id: 228,
          question: 'Element burchaklarini yumaloqlash uchun qaysi xususiyat ishlatiladi?',
          options: ['corner-round', 'border-radius', 'edge-circle', 'border-curve'],
          correctOption: 1
        },
        {
          id: 229,
          question: 'CSS Gridda teng nisbatdagi ulush birligi qaysi?',
          options: ['fr (fractional unit)', 'pt', 'gr (grid ratio)', 'un'],
          correctOption: 0
        },
        {
          id: 230,
          question: 'Kursor element ustiga kelganda qo\'lcha (bosish belgisi) paydo bo\'lishi uchun nima yoziladi?',
          options: ['cursor: clicker;', 'cursor: pointer;', 'mouse: hand;', 'pointer: active;'],
          correctOption: 1
        }
      ]
    }
  },

  // ---------------- JAVASCRIPT ----------------
  javascript: {
    1: {
      title: '1-Modul Oraliq Testi (2-Modulga O\'tish)',
      scopeText: '1-Modulda o\'tilgan mavzular bo\'yicha (JS Kirish, Tiplar, Operatorlar, Shartlar, Sikllar, Funksiyalar va String)',
      passingScore: 70,
      targetModuleIndex: 2,
      questions: [
        {
          id: 301,
          question: 'JavaScriptda qiymati keyinchalik o\'zgarmas (o\'zgarmas) o\'zgaruvchi qaysi kalit so\'z bilan e\'lon qilinadi?',
          options: ['var', 'let', 'const', 'fixed'],
          correctOption: 2
        },
        {
          id: 302,
          question: 'Qaysi ma\'lumot turi JavaScriptda Primitive tur hisoblanmaydi?',
          options: ['String', 'Number', 'Boolean', 'Object'],
          correctOption: 3
        },
        {
          id: 303,
          question: '`===` va `==` operatorlarining farqi nimada?',
          options: ['Farqi yo\'q', '`===` ma\'lumot turini ham, qiymatini ham tekshiradi; `==` faqat qiymatni', '`==` qat\'iy, `===` esa noqat\'iy', '`===` faqat matnlar uchun ishlatiladi'],
          correctOption: 1
        },
        {
          id: 304,
          question: '`typeof null` nima natija qaytaradi?',
          options: ['"null"', '"undefined"', '"object"', '"boolean"'],
          correctOption: 2
        },
        {
          id: 305,
          question: '1 dan 10 gacha bo\'lgan sonlarni ketma-ket takrorlash uchun qaysi sikl eng qulay?',
          options: ['for', 'repeat', 'loop-until', 'goto'],
          correctOption: 0
        },
        {
          id: 306,
          question: 'Funksiyaning qiymat qaytarish kalit so\'zi qaysi?',
          options: ['send', 'output', 'return', 'give'],
          correctOption: 2
        },
        {
          id: 307,
          question: 'Arrow function (strelkali funksiya) sintaksisi qaysi javobda to\'g\'ri ko\'rsatilgan?',
          options: ['const add = (a, b) => a + b;', 'def add(a, b): a + b', 'function add -> a + b', 'add = lambda a, b: a + b'],
          correctOption: 0
        },
        {
          id: 308,
          question: 'Matn uzunligini (belgilar sonini) aniqlovchi xususiyat qaysi?',
          options: ['str.size()', 'str.length', 'str.count', 'str.total'],
          correctOption: 1
        },
        {
          id: 309,
          question: 'String ichidagi barcha harflarni katta qilish metodi qaysi?',
          options: ['toUpperCase()', 'toCapital()', 'toBig()', 'capitalize()'],
          correctOption: 0
        },
        {
          id: 310,
          question: 'Mantiqiy "VA" (AND) operatori qaysi belgi bilan yoziladi?',
          options: ['||', '&&', 'AND', '!='],
          correctOption: 1
        }
      ]
    },
    2: {
      title: '2-Modul Oraliq Testi (3-Modulga O\'tish)',
      scopeText: '1 va 2-Modullarda o\'tilgan mavzular bo\'yicha (Numbers, Math, Obyektlar, Array metodlari va Asoslar)',
      passingScore: 70,
      targetModuleIndex: 3,
      questions: [
        {
          id: 311,
          question: 'Massiv oxiriga yangi element qo\'shish uchun qaysi metod ishlatiladi?',
          options: ['pop()', 'push()', 'shift()', 'unshift()'],
          correctOption: 1
        },
        {
          id: 312,
          question: 'Massivning birinchi elementini olib tashlash metodi qaysi?',
          options: ['pop()', 'shift()', 'removeFirst()', 'spliceFirst()'],
          correctOption: 1
        },
        {
          id: 313,
          question: 'Massivdagi har bir elementni o\'zgartirib yangi massiv hosil qiluvchi metod qaysi?',
          options: ['filter()', 'map()', 'forEach()', 'reduce()'],
          correctOption: 1
        },
        {
          id: 314,
          question: 'Faqat ma\'lum shartga to\'g\'ri kelgan elementlarni saralab oluvchi metod qaysi?',
          options: ['filter()', 'find()', 'slice()', 'sort()'],
          correctOption: 0
        },
        {
          id: 315,
          question: '0 dan 1 gacha bo\'lgan tasodifiy son yaratuvchi Math metodi qaysi?',
          options: ['Math.random()', 'Math.ceil()', 'Math.floor()', 'Math.round()'],
          correctOption: 0
        },
        {
          id: 316,
          question: 'Sonni eng yaqin kichik butun songa yaxlitlovchi metod qaysi?',
          options: ['Math.floor()', 'Math.ceil()', 'Math.round()', 'Math.abs()'],
          correctOption: 0
        },
        {
          id: 317,
          question: 'Obyektdagi kalit (key) va qiymatlarni (value) olishda qaysi operator yoki metod ishlatiladi?',
          options: ['Object.keys() va Object.values()', 'Object.items()', 'Object.split()', 'Object.toArray()'],
          correctOption: 0
        },
        {
          id: 318,
          question: 'Sonni stringga aylantiruvchi metod qaysi?',
          options: ['toString()', 'toNumber()', 'parseInt()', 'parseFloat()'],
          correctOption: 0
        },
        {
          id: 319,
          question: 'Massivning elementlari yig\'indisini hisoblashda eng samarali metod qaysi?',
          options: ['reduce()', 'forEach()', 'map()', 'every()'],
          correctOption: 0
        },
        {
          id: 320,
          question: 'Obyekt ichidagi xususiyatni o\'chirish (delete) uchun qaysi kalit so\'z ishlatiladi?',
          options: ['remove', 'delete', 'destroy', 'clear'],
          correctOption: 1
        }
      ]
    },
    3: {
      title: '3-Modul Oraliq Testi (4-Modulga O\'tish)',
      scopeText: '1, 2 va 3-Modullarda o\'tilgan mavzular bo\'yicha (DOM, Events, Storage, Destructuring, Spread, Date va Asoslar)',
      passingScore: 70,
      targetModuleIndex: 4,
      questions: [
        {
          id: 321,
          question: 'HTML elementini ID bo\'yicha topish uchun qaysi DOM metodi ishlatiladi?',
          options: ['document.getElementById()', 'document.selectId()', 'document.find()', 'document.search()'],
          correctOption: 0
        },
        {
          id: 322,
          question: 'Elementga sichqoncha bosilgandagi hodisani (click) eshitish uchun nima yoziladi?',
          options: ['element.addEventListener("click", callback)', 'element.attach("onClick")', 'element.watch("click")', 'element.listen("click")'],
          correctOption: 0
        },
        {
          id: 323,
          question: 'Brauzer yopilgandan keyin ham ma\'lumotni xotirada saqlab qoluvchi ombor qaysi?',
          options: ['sessionStorage', 'localStorage', 'RAMStorage', 'CacheStorage'],
          correctOption: 1
        },
        {
          id: 324,
          question: 'LocalStorage da ma\'lumot saqlash uchun qaysi metod ishlatiladi?',
          options: ['localStorage.setItem(key, value)', 'localStorage.save(key, value)', 'localStorage.add(key, value)', 'localStorage.put(key, value)'],
          correctOption: 0
        },
        {
          id: 325,
          question: 'JavaScript obyektini JSON matn (string) formatiga o\'girish uchun qaysi metod ishlatiladi?',
          options: ['JSON.parse()', 'JSON.stringify()', 'JSON.toString()', 'JSON.encode()'],
          correctOption: 1
        },
        {
          id: 326,
          question: 'JSON matnni yana JavaScript obyektiga aylantirish qaysi metod orqali qilinadi?',
          options: ['JSON.parse()', 'JSON.stringify()', 'JSON.decode()', 'JSON.toObject()'],
          correctOption: 0
        },
        {
          id: 327,
          question: 'Massiv yoki obyektni yoyib yuborish (Spread operator) qaysi belgi bilan yoziladi?',
          options: ['***', '...', '&&&', '>>>'],
          correctOption: 1
        },
        {
          id: 328,
          question: '`const { name, age } = user;` sintaksisi nima deyiladi?',
          options: ['Destructuring assignment', 'Object spreading', 'Property grouping', 'De-objecting'],
          correctOption: 0
        },
        {
          id: 329,
          question: 'DOM elementining HTML tarkibini matn bilan birga o\'zgartirish xususiyati qaysi?',
          options: ['innerHTML', 'textOnly', 'outerContent', 'contentNode'],
          correctOption: 0
        },
        {
          id: 330,
          question: 'Formaning sahifani qayta yuklash (reload) odatini to\'xtatish uchun qaysi metod chaqiriladi?',
          options: ['e.preventDefault()', 'e.stopPropagation()', 'e.stopReload()', 'e.cancel()'],
          correctOption: 0
        }
      ]
    }
  },

  // ---------------- REACT ----------------
  react: {
    1: {
      title: '1-Modul Oraliq Testi (2-Modulga O\'tish)',
      scopeText: '1-Modulda o\'tilgan mavzular bo\'yicha (React Kirish, JSX, Komponentlar, Stillar va Statik Data)',
      passingScore: 70,
      targetModuleIndex: 2,
      questions: [
        {
          id: 401,
          question: 'React nima?',
          options: ['Foydalanuvchi interfeyslarini (UI) yaratish uchun JavaScript kutubxonasi', 'PostgreSQL ma\'lumotlar bazasi boshqaruvchisi', 'CSS preprotsessori', 'Node.js server freymvorki'],
          correctOption: 0
        },
        {
          id: 402,
          question: 'JSX nima?',
          options: ['Java XML', 'JavaScript ichida HTMLga o\'xshash sintaksis yozish imkonini beruvchi kengaytma', 'Faqat JSON fayllar formati', 'Brauzerning yangi dvigateli'],
          correctOption: 1
        },
        {
          id: 403,
          question: 'React da komponent nomi qanday harf bilan boshlanishi SHART?',
          options: ['Kichik harf bilan', 'Katta harf (Capital/PascalCase) bilan', '_ belgisi bilan', '$ belgisi bilan'],
          correctOption: 1
        },
        {
          id: 404,
          question: 'JSX ichida JavaScript ifodalarini (o\'zgaruvchi, hisob-kitob) yozish uchun qaysi qavslar ishlatiladi?',
          options: ['{{ ... }}', '[ ... ]', '{ ... } (jingalak qavslar)', '( ... )'],
          correctOption: 2
        },
        {
          id: 405,
          question: 'JSX da `class` o\'rniga qaysi atribut nomi ishlatiladi?',
          options: ['className', 'classId', 'cssClass', 'styleClass'],
          correctOption: 0
        },
        {
          id: 406,
          question: 'React komponenti JSX qaytarayotganda nechta asosiy ildiz (root) element bo\'lishi kerak?',
          options: ['Xohlagancha bo\'lishi mumkin', 'Faqat bitta umumiy ota element (yoki Fragment <></>)', 'Kamida uchta', 'Ildiz element bo\'lishi shart emas'],
          correctOption: 1
        },
        {
          id: 407,
          question: 'Massiv elementlarini JSX da render qilishda qaysi metod eng ko\'p ishlatiladi?',
          options: ['forEach()', 'map()', 'filter()', 'reduce()'],
          correctOption: 1
        },
        {
          id: 408,
          question: '`map()` orqali ro\'yxat chizilganda har bir elementga nima uchun unikal `key` berilishi kerak?',
          options: ['Chiroyli ko\'rinishi uchun', 'React Virtual DOM da o\'zgargan elementni tez topib qayta render qilishi uchun', 'CSS ishlamay qolmasligi uchun', 'Majburiy emas'],
          correctOption: 1
        },
        {
          id: 409,
          question: 'Virtual DOM ning haqiqiy DOM dan asosiy afzalligi nimada?',
          options: ['Xotirani to\'ldirmaydi va faqat o\'zgargan qismnigina yangilaydi (diffing)', 'Rasmlarni avtomatik siqadi', 'Internet tezligini 2 barobar oshiradi', 'Backend bazasini o\'chirib tashlaydi'],
          correctOption: 0
        },
        {
          id: 410,
          question: 'Bo\'sh teglardan iborat React Fragment sintaksisi qanday yoziladi?',
          options: ['<fragment></fragment>', '<></>', '<null></null>', '<empty></empty>'],
          correctOption: 1
        }
      ]
    },
    2: {
      title: '2-Modul Oraliq Testi (3-Modulga O\'tish)',
      scopeText: '1 va 2-Modullarda o\'tilgan mavzular bo\'yicha (Props, useState Hook, Hodisalar va Formlar)',
      passingScore: 70,
      targetModuleIndex: 3,
      questions: [
        {
          id: 411,
          question: 'Ota komponentdan bola komponentga ma\'lumot uzatish mexanizmi nima deyiladi?',
          options: ['Props (Properties)', 'State', 'Context', 'LocalStorage'],
          correctOption: 0
        },
        {
          id: 412,
          question: 'Props larni bola komponent ichida o\'zgartirish (mutate qilish) mumkinmi?',
          options: ['Ha, bemalol o\'zgartirish mumkin', 'Yo\'q, Props faqat o\'qish uchun (Read-only / Immutable)', 'Faqat son bo\'lsa mumkin', 'Faqat useState bilan mumkin'],
          correctOption: 1
        },
        {
          id: 413,
          question: 'Komponent ichida o\'zgaruvchan holatni boshqarish uchun qaysi Hook ishlatiladi?',
          options: ['useEffect', 'useRef', 'useState', 'useMemo'],
          correctOption: 2
        },
        {
          id: 414,
          question: '`const [count, setCount] = useState(0);` ifodasida boshlang\'ich qiymat nima?',
          options: ['count', 'setCount', '0', 'undefined'],
          correctOption: 2
        },
        {
          id: 415,
          question: 'Komponent state o\'zgarganda React nima qiladi?',
          options: ['Brauzerni butunlay yangilaydi (reload)', 'Komponentni qayta render (re-render) qiladi', 'Fayllarni qayta yuklaydi', 'Hech narsa sodir bo\'lmaydi'],
          correctOption: 1
        },
        {
          id: 416,
          question: 'Tugma bosilish hodisasi JSX da qanday yoziladi?',
          options: ['onclick={handleClick}', 'onClick={handleClick}', 'on-click="handleClick()"', 'click={handleClick}'],
          correctOption: 1
        },
        {
          id: 417,
          question: 'Inputdagi qiymat o\'zgarganini ushlab olish uchun qaysi hodisa beriladi?',
          options: ['onChange', 'onInput', 'onType', 'onModify'],
          correctOption: 0
        },
        {
          id: 418,
          question: 'Input qiymati React state ga bog\'langan bo\'lsa, bunday element nima deyiladi?',
          options: ['Uncontrolled component', 'Controlled component (Nazorat qilinuvchi)', 'Static element', 'Ref input'],
          correctOption: 1
        },
        {
          id: 419,
          question: 'State ni to\'g\'ridan-to\'g\'ri `count = count + 1` qilib o\'zgartirish to\'g\'rimi?',
          options: ['Ha, eng qulay yo\'l', 'Noto\'g\'ri, har doim setter funksiya (setCount) orqali yangilash kerak', 'Farqi yo\'q', 'Faqat sonlarda to\'g\'ri'],
          correctOption: 1
        },
        {
          id: 420,
          question: 'Boolean holatni teskarisiga o\'girish qanday yoziladi?',
          options: ['setIsDark(!isDark)', 'setIsDark(reverse)', 'setIsDark(opposite)', 'isDark = false'],
          correctOption: 0
        }
      ]
    },
    3: {
      title: '3-Modul Oraliq Testi (4-Modulga O\'tish)',
      scopeText: '1, 2 va 3-Modullarda o\'tilgan mavzular bo\'yicha (useEffect, Fetch API, Axios, CRUD va Asoslar)',
      passingScore: 70,
      targetModuleIndex: 4,
      questions: [
        {
          id: 421,
          question: 'Komponent yuklanganda tashqi API dan ma\'lumot olish yoki yon ta\'sir bajarish uchun qaysi Hook ishlatiladi?',
          options: ['useState', 'useReducer', 'useEffect', 'useCallback'],
          correctOption: 2
        },
        {
          id: 422,
          question: '`useEffect` faqat bir marta (komponent ochilganda) ishlashi uchun uning dependency massivi qanday bo\'lishi kerak?',
          options: ['Bo\'sh massiv `[]` bo\'lishi kerak', 'Umuman dependency berilmasligi kerak', '`[true]` bo\'lishi kerak', '`[null]` bo\'lishi kerak'],
          correctOption: 0
        },
        {
          id: 423,
          question: '`useEffect` ga dependency massivi berilmasa nima sodir bo\'ladi?',
          options: ['Hech qachon ishlamaydi', 'Har bir re-render bo\'lganda qayta ishlayveradi', 'Xatolik beradi', 'Faqat chiqib ketganda ishlaydi'],
          correctOption: 1
        },
        {
          id: 424,
          question: 'Serverdan HTTP so\'rovlar orqali ma\'lumot olish va jo\'natishda eng mashhur kutubxona qaysi?',
          options: ['Axios', 'Lodash', 'Moment', 'Tailwind'],
          correctOption: 0
        },
        {
          id: 425,
          question: 'CRUD qisqartmasi nimalarni anglatadi?',
          options: ['Create, Read, Update, Delete', 'Code, Run, Update, Debug', 'Copy, Read, Undo, Do', 'Connect, Request, Upload, Download'],
          correctOption: 0
        },
        {
          id: 426,
          question: 'Serverga yangi ma\'lumot jo\'natish (Create) uchun qaysi HTTP metodi ishlatiladi?',
          options: ['GET', 'POST', 'PUT', 'DELETE'],
          correctOption: 1
        },
        {
          id: 427,
          question: 'Serverdan mavjud ma\'lumotni o\'qib olish (Read) uchun qaysi HTTP metodi ishlatiladi?',
          options: ['GET', 'POST', 'PATCH', 'OPTIONS'],
          correctOption: 0
        },
        {
          id: 428,
          question: 'Serverdagi ma\'lumotni o\'chirish (Delete) uchun qaysi HTTP metodi ishlatiladi?',
          options: ['REMOVE', 'DELETE', 'POST', 'PURGE'],
          correctOption: 1
        },
        {
          id: 429,
          question: '`useEffect` ichida tozalash funksiyasi (cleanup function, masalan intervalni to\'xtatish) qanday qaytariladi?',
          options: ['return () => { clearInterval(id); }', 'cleanup { clearInterval(id); }', 'stop: clearInterval(id)', 'destroy(id)'],
          correctOption: 0
        },
        {
          id: 430,
          question: 'API dan ma\'lumot yuklanayotgan paytda ekranga Loader (spinner) chiqarish holati qanday nomlanadi?',
          options: ['Loading state', 'Waiting loop', 'Pause hook', 'Lag status'],
          correctOption: 0
        }
      ]
    }
  }
};

// ==========================================
// YAKUNIY IMTIHON (20 TA SAVOL HAR BIR KURS UCHUN)
// Barcha 1, 2, 3 va 4-Modul mavzulari bo'yicha to'liq 20 ta savol
// ==========================================

export const COURSE_FINAL_20_EXAMS = {
  html: [
    { id: 1, question: 'HTML nima uchun ishlatiladi?', options: ['Web sahifaning ko\'rinishi va stillarini berish uchun', 'Web sahifaning strukturasi va tarkibini belgilash uchun', 'Server bilan ma\'lumotlar bazasini bog\'lash uchun', 'Brauzerda murakkab hisob-kitoblar bajarish uchun'], correctOption: 1 },
    { id: 2, question: 'Qaysi teg birinchi darajali eng asosiy sarlavha hisoblanadi?', options: ['<h6>', '<head>', '<h1>', '<header>'], correctOption: 2 },
    { id: 3, question: 'Boshqa sahifaga o\'tish uchun qaysi havola (link) tegi ishlatiladi?', options: ['<link>', '<a>', '<nav>', '<href>'], correctOption: 1 },
    { id: 4, question: 'HTML5 semantik teglariga qaysi javobda to\'g\'ri misol keltirilgan?', options: ['<div>, <span>, <b>', '<header>, <nav>, <article>, <footer>', '<font>, <center>, <marquee>', '<table>, <tr>, <td>'], correctOption: 1 },
    { id: 5, question: 'Rasm qo\'shishda qaysi teg va uning majburiy atributlari ishlatiladi?', options: ['<image src="..." alt="...">', '<img href="..." title="...">', '<img src="..." alt="...">', '<picture link="..." text="...">'], correctOption: 2 },
    { id: 6, question: 'Tartiblangan ro\'yxat (raqamlangan) yaratish uchun qaysi teg ishlatiladi?', options: ['<ul>', '<ol>', '<li>', '<dl>'], correctOption: 1 },
    { id: 7, question: 'Formada foydalanuvchidan parol kiritishni so\'rash uchun qaysi input turi ishlatiladi?', options: ['<input type="text">', '<input type="password">', '<input type="secret">', '<input type="hidden">'], correctOption: 1 },
    { id: 8, question: 'Jadval qatorini (row) belgilash uchun qaysi teg ishlatiladi?', options: ['<td>', '<th>', '<tr>', '<table-row>'], correctOption: 2 },
    { id: 9, question: 'HTML hujjatining meta ma\'lumotlari qaysi bo\'lim ichida joylashadi?', options: ['<header>', '<body>', '<head>', '<meta-group>'], correctOption: 2 },
    { id: 10, question: 'Matnni yangi qatorga tushirish uchun qaysi toq (self-closing) teg ishlatiladi?', options: ['<hr>', '<br>', '<p>', '<enter>'], correctOption: 1 },
    { id: 11, question: 'Matnni qalin (bold) va semantik jihatdan muhim qilish uchun qaysi teg to\'g\'ri?', options: ['<bold>', '<strong>', '<black>', '<heavy>'], correctOption: 1 },
    { id: 12, question: 'Matnni og\'ma (kursiv) va urg\'uli qilish uchun qaysi teg ishlatiladi?', options: ['<italic>', '<em> (emphasis)', '<slant>', '<oblique>'], correctOption: 1 },
    { id: 13, question: 'Qidiruv tizimlari (SEO) uchun sahifa tavsifini berishda qaysi meta teg ishlatiladi?', options: ['<meta name="description" content="...">', '<meta title="...">', '<seo desc="...">', '<keyword meta="...">'], correctOption: 0 },
    { id: 14, question: 'HTML form ma\'lumotlarini serverga jo\'natish tugmasi qanday bo\'ladi?', options: ['<input type="submit"> yoki <button type="submit">', '<button action="send">', '<input type="save">', '<send-btn>'], correctOption: 0 },
    { id: 15, question: 'Input elementiga tushuntirish yorlig\'i (label) bog\'lash uchun qaysi atribut ishlatiladi?', options: ['for (yoki htmlFor)', 'name', 'bind', 'connect'], correctOption: 0 },
    { id: 16, question: 'Formani to\'ldirish majburiy ekanligini bildiruvchi atribut qaysi?', options: ['must', 'required', 'obligatory', 'valid'], correctOption: 1 },
    { id: 17, question: 'Sayt pastki qismi (mualliflik huquqi, aloqa) qaysi semantik tegda joylashadi?', options: ['<bottom>', '<end>', '<footer>', '<footnote>'], correctOption: 2 },
    { id: 18, question: 'Mustaqil, to\'liq mazmunga ega maqola yoki post uchun qaysi teg ishlatiladi?', options: ['<section>', '<article>', '<aside>', '<main>'], correctOption: 1 },
    { id: 19, question: 'Asosiy kontentdan tashqaridagi yon panel (sidebar) qaysi semantik tegda yoziladi?', options: ['<sidebar>', '<aside>', '<subcontent>', '<panel>'], correctOption: 1 },
    { id: 20, question: 'Belgilar kodlashini (harflar, krill/lotin) to\'g\'ri ko\'rsatish uchun qaysi meta qo\'yiladi?', options: ['<meta charset="UTF-8">', '<meta language="all">', '<meta unicode="true">', '<meta code="text">'], correctOption: 0 }
  ],
  css: [
    { id: 1, question: 'CSS qisqartmasining to\'liq ma\'nosi nima?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Styling Syntax', 'Colorful Style Structure'], correctOption: 1 },
    { id: 2, question: 'CSS Box Model tarkibiga nimalar kiradi?', options: ['Content, Padding, Border, Margin', 'Header, Nav, Section, Footer', 'Color, Background, Font, Size', 'Width, Height, Display, Float'], correctOption: 0 },
    { id: 3, question: 'Flexboxda asosiy o\'q (main axis) bo\'yicha elementlarni markazlashtirish uchun qaysi xususiyat ishlatiladi?', options: ['align-items: center;', 'justify-content: center;', 'text-align: center;', 'place-items: center;'], correctOption: 1 },
    { id: 4, question: 'Qaysi CSS selektori eng yuqori ustunlikka (specificity) ega?', options: ['Class (.menu)', 'Element nomi (div)', 'ID (#header)', 'Universal selektor (*)'], correctOption: 2 },
    { id: 5, question: 'Elementni butun brauzer oynasiga nisbatan harakatsiz qotirib qo\'yish uchun qaysi position qiymati beriladi?', options: ['position: relative;', 'position: absolute;', 'position: fixed;', 'position: sticky;'], correctOption: 2 },
    { id: 6, question: 'CSS Gridda 3 ta teng ustun yaratish uchun qaysi sintaksis to\'g\'ri?', options: ['grid-template-columns: repeat(3, 1fr);', 'grid-columns: 33% 33% 33%;', 'display: grid-3-cols;', 'columns: 3 auto;'], correctOption: 0 },
    { id: 7, question: 'Mobil moslashuvchanlik (media queries) qaysi direktiva orqali yoziladi?', options: ['@screen (max-width: 768px)', '@media (max-width: 768px)', '@responsive (mobile)', '@device-width: 768px'], correctOption: 1 },
    { id: 8, question: 'Padding va Margin ning asosiy farqi nimada?', options: ['Padding tashqi masofa, Margin ichki masofa', 'Padding ichki masofa, Margin tashqi masofa', 'Farqi yo\'q, bir xil vazifani bajaradi', 'Margin faqat matnlar uchun ishlatiladi'], correctOption: 1 },
    { id: 9, question: 'BEM metodologiyasida element va modifikator qanday belgilar bilan ajratiladi?', options: ['Element: __ (ikkita pastki chiziq), Modifikator: -- (ikkita tire)', 'Element: -- , Modifikator: __', 'Element: . , Modifikator: #', 'Element: - , Modifikator: _'], correctOption: 0 },
    { id: 10, question: 'Elementning ko\'rinishini silliq o\'zgartirish (animatsion holatga o\'tish) qaysi xususiyat bilan beriladi?', options: ['transform', 'transition', 'animation-duration', 'hover-effect'], correctOption: 1 },
    { id: 11, question: 'CSS Gridda elementlar orasidagi masofani beruvchi xususiyat qaysi?', options: ['space', 'gap (yoki grid-gap)', 'margin-between', 'grid-spacing'], correctOption: 1 },
    { id: 12, question: 'Shrift oilasini belgilovchi xususiyat qaysi?', options: ['font-family', 'font-style', 'font-weight', 'text-font'], correctOption: 0 },
    { id: 13, question: 'CSS o\'zgaruvchilari (custom properties) qanday e\'lon qilinadi?', options: ['--main-color: #3b82f6;', '$main-color = #3b82f6;', '@color: #3b82f6;', 'var(main-color): #3b82f6;'], correctOption: 0 },
    { id: 14, question: 'CSS o\'zgaruvchisini chaqirib ishlatish sintaksisi qaysi?', options: ['color: var(--main-color);', 'color: get(--main-color);', 'color: $main-color;', 'color: use(--main-color);'], correctOption: 0 },
    { id: 15, question: 'Elementni to\'liq doira (aylana) qilish uchun qaysi border-radius qiymati beriladi?', options: ['border-radius: 50%;', 'border-radius: 100px;', 'border-radius: circle;', 'border-radius: round;'], correctOption: 0 },
    { id: 16, question: 'Flexboxda elementlar teskari tartibda joylashishi uchun nima yoziladi?', options: ['flex-direction: row-reverse;', 'direction: rtl;', 'flex-flow: backwards;', 'order: -1;'], correctOption: 0 },
    { id: 17, question: 'Matn harflari orasidagi masofani sozlash xususiyati qaysi?', options: ['word-spacing', 'letter-spacing', 'font-kerning', 'text-space'], correctOption: 1 },
    { id: 18, question: 'Elementning ortiqcha sig\'may qolgan tarkibini yashirish xususiyati qaysi?', options: ['display: clip;', 'overflow: hidden;', 'visibility: cut;', 'box-clip: true;'], correctOption: 1 },
    { id: 19, question: 'Tailwind CSS nima?', options: ['Utility-first CSS freymvorki', 'JavaScript kutubxonasi', 'Ma\'lumotlar bazasi', 'Brauzer extension'], correctOption: 0 },
    { id: 20, question: 'Sass/SCSS nima?', options: ['CSS preprotsessori (o\'zgaruvchilar, nesting, mixinlar qo\'shuvchi)', 'HTML generator', 'Server texnologiyasi', 'Faqat ranglar palitrasi'], correctOption: 0 }
  ],
  javascript: [
    { id: 1, question: 'JavaScriptda qaysi kalit so\'zlar bilan o\'zgaruvchi e\'lon qilinadi?', options: ['var, let, const', 'dim, variable, val', 'string, number, boolean', 'def, make, set'], correctOption: 0 },
    { id: 2, question: '`===` va `==` operatorlarining farqi nimada?', options: ['Farqi yo\'q', '`===` turini ham, qiymatini ham tekshiradi; `==` esa turni avtomatik o\'zgartirib tekshiradi', '`==` qat\'iy tenglik, `===` esa noqat\'iy tenglik', '`===` faqat raqamlar uchun ishlatiladi'], correctOption: 1 },
    { id: 3, question: 'Qaysi ma\'lumot turi Primitive hisoblanmaydi?', options: ['String', 'Number', 'Object', 'Boolean'], correctOption: 2 },
    { id: 4, question: 'Massiv oxiriga yangi element qo\'shish uchun qaysi metod ishlatiladi?', options: ['pop()', 'push()', 'shift()', 'unshift()'], correctOption: 1 },
    { id: 5, question: 'DOM nima?', options: ['Data Oriented Model', 'Document Object Model', 'Digital Operation Management', 'Desktop Operating Mechanism'], correctOption: 1 },
    { id: 6, question: 'Asinxron kodni boshqarish uchun ES6 da kiritilgan mexanizm qaysi?', options: ['Callback Hell', 'Promise', 'Thread', 'Timer Loop'], correctOption: 1 },
    { id: 7, question: '`async / await` nima ustiga qurilgan qulay sintaktik yondashuv (syntax sugar) hisoblanadi?', options: ['XHR so\'rovlar', 'Generatorlar', 'Promise lar', 'DOM hodisalari'], correctOption: 2 },
    { id: 8, question: 'Closure (yopilish) nima?', options: ['Funksiyaning o\'zidan tashqaridagi (lexical scope) o\'zgaruvchilarni eslab qolish qobiliyati', 'Dasturni to\'xtatish buyrug\'i', 'Obyektni yopib qo\'yish funksiyasi', 'Faqat bir marta chiquvchi oyna'], correctOption: 0 },
    { id: 9, question: 'Brauzerda ma\'lumotni sahifa yopilgandan keyin ham saqlab qoluvchi ombor qaysi?', options: ['sessionStorage', 'localStorage', 'MemoryCache', 'TemporaryStore'], correctOption: 1 },
    { id: 10, question: 'JavaScript qanday dasturlash tili hisoblanadi?', options: ['Multi-threaded va to\'g\'ridan-to\'g\'ri kompilyatsiya bo\'luvchi', 'Single-threaded (bitta oqimli), asinxron va event-driven', 'Faqat server tomonida ishlaydigan statik til', 'Faqat animatsiyalar uchun skript tili'], correctOption: 1 },
    { id: 11, question: 'Qaysi metod massivdagi har bir elementni o\'zgartirib yangi massiv qaytaradi?', options: ['forEach()', 'map()', 'filter()', 'reduce()'], correctOption: 1 },
    { id: 12, question: 'Massivdan faqat shartni qanoatlantiruvchi elementlarni saralash metodi qaysi?', options: ['filter()', 'find()', 'every()', 'some()'], correctOption: 0 },
    { id: 13, question: 'Xatoliklarni ushlab olish va dastur to\'xtab qolishining oldini olish bloki qaysi?', options: ['if ... else', 'try ... catch', 'while ... do', 'test ... verify'], correctOption: 1 },
    { id: 14, question: '`NaN` nimani anglatadi?', options: ['Not a Number (Raqam emas)', 'Null and Negative', 'New array Number', 'No action Needed'], correctOption: 0 },
    { id: 15, question: 'Event Loop ning asosiy vazifasi nima?', options: ['Call Stack bo\'shaganida Callback Queue dan vazifalarni olib bajarishga uzatish', 'HTML fayllarni tekshirish', 'CSS kodlarini tozalash', 'Kompyuterni tezlashtirish'], correctOption: 0 },
    { id: 16, question: 'Fetch API muvaffaqiyatli server javobini qaysi formatga aylantiradi?', options: ['response.json()', 'response.html()', 'response.toData()', 'response.parse()'], correctOption: 0 },
    { id: 17, question: 'Obyekt nusxasini (shallow copy) yaratish uchun qaysi operator qulay?', options: ['Spread operator `const copy = { ...obj }`', 'Equal operator `copy = obj`', 'Duplicate operator', 'Clone function'], correctOption: 0 },
    { id: 18, question: 'Ma\'lum vaqt oralig\'ida kodni takroriy ishga tushirish funksiyasi qaysi?', options: ['setTimeout()', 'setInterval()', 'repeatTimer()', 'loopDelay()'], correctOption: 1 },
    { id: 19, question: 'Kodni ma\'lum kechikishdan keyin BIR MARTA ishga tushirish funksiyasi qaysi?', options: ['setTimeout()', 'setInterval()', 'delay()', 'wait()'], correctOption: 0 },
    { id: 20, question: 'ES6 Class larida merosxo\'rlik (inheritance) qaysi kalit so\'z bilan o\'rnatiladi?', options: ['inherits', 'extends', 'implements', 'prototypeOf'], correctOption: 1 }
  ],
  react: [
    { id: 1, question: 'React nima?', options: ['Foydalanuvchi interfeyslarini (UI) yaratish uchun JavaScript kutubxonasi', 'PostgreSQL ma\'lumotlar bazasi boshqaruvi', 'CSS preprotsessori', 'Node.js server ramkasi'], correctOption: 0 },
    { id: 2, question: 'JSX nima?', options: ['Java XML', 'JavaScript ichida HTML ga o\'xshash sintaksis yozish imkonini beruvchi kengaytma', 'Faqat JSON fayllar formati', 'Brauzerning yangi dvigateli'], correctOption: 1 },
    { id: 3, question: 'Komponent ichida o\'zgaruvchan holatni (state) boshqarish uchun qaysi Hook ishlatiladi?', options: ['useEffect', 'useState', 'useRef', 'useContext'], correctOption: 1 },
    { id: 4, question: 'Tashqi API dan ma\'lumot olish yoki komponent yuklanganda yon ta\'sir bajarish uchun qaysi Hook ishlatiladi?', options: ['useState', 'useMemo', 'useEffect', 'useCallback'], correctOption: 2 },
    { id: 5, question: 'Ota komponentdan bola komponentga ma\'lumot qanday uzatiladi?', options: ['Props orqali', 'Global o\'zgaruvchilar orqali', 'Faqat localStorage orqali', 'DOM selektorlari orqali'], correctOption: 0 },
    { id: 6, question: 'Ro\'yxatlarni (list) `map()` orqali render qilishda nima uchun har bir elementga `key` berilishi shart?', options: ['Chiroyli ko\'rinishi uchun', 'React virtual DOM da elementlarni samarali aniqlashi va yangilashi uchun', 'Xatolik chiqmasligi uchun shart emas', 'CSS stillari to\'g\'ri tushishi uchun'], correctOption: 1 },
    { id: 7, question: 'React da marshrutlash (routing) uchun eng keng qo\'llaniladigan kutubxona qaysi?', options: ['react-router-dom', 'express-router', 'browser-navigator', 'page-switcher'], correctOption: 0 },
    { id: 8, question: 'Prop Drilling muammosini hal qilish uchun React taqdim etgan o\'rnatilgan mexanizm qaysi?', options: ['Redux', 'Context API (createContext / useContext)', 'LocalStorage', 'QueryClient'], correctOption: 1 },
    { id: 9, question: 'Komponent state o\'zgarganda nima sodir bo\'ladi?', options: ['Brauzer to\'liq yangilanadi (reload)', 'Komponent qayta render bo\'ladi (re-render)', 'Fayllar qayta yuklanadi', 'Hech narsa bo\'lmaydi'], correctOption: 1 },
    { id: 10, question: 'Virtual DOM ning asosiy afzalligi nimada?', options: ['Haqiqiy DOM ga faqat o\'zgargan qismlarni hisoblab (diffing) minimal ta\'sir bilan yangilaydi', 'Sayt hajmini 10 barobar qisqartiradi', 'Barcha xavfsizlik muammolarini avtomatik yopadi', 'CSS fayllarni avtomatik tuzadi'], correctOption: 0 },
    { id: 11, question: 'URL dagi dinamik parametrlarni (masalan: `/courses/:slug`) olish uchun react-router-dom ning qaysi hooki ishlatiladi?', options: ['useNavigate', 'useParams', 'useLocation', 'useRouteMatch'], correctOption: 1 },
    { id: 12, question: 'Boshqa sahifaga dasturiy ravishda yo\'naltirish (navigate qilish) uchun qaysi hook ishlatiladi?', options: ['useParams', 'useNavigate', 'useHistory', 'useRedirect'], correctOption: 1 },
    { id: 13, question: 'DOM elementiga to\'g\'ridan-to\'g\'ri havola (reference) olish uchun qaysi Hook ishlatiladi?', options: ['useRef', 'useState', 'useMemo', 'useId'], correctOption: 0 },
    { id: 14, question: 'Og\'ir hisob-kitoblar natijasini keshlab saqlash (memoizatsiya) uchun qaysi Hook ishlatiladi?', options: ['useMemo', 'useCallback', 'useEffect', 'useCache'], correctOption: 0 },
    { id: 15, question: 'Funksiya instansiyasini har bir re-renderda qayta yaratmaslik uchun qaysi Hook ishlatiladi?', options: ['useCallback', 'useMemo', 'useRef', 'useConstant'], correctOption: 0 },
    { id: 16, question: 'React formalarida input qiymatini boshqarishda `value` va qaysi event birga ishlatiladi?', options: ['onClick', 'onChange', 'onInput', 'onBlur'], correctOption: 1 },
    { id: 17, question: 'React fragmentining to\'liq nomi qaysi?', options: ['<React.Fragment>', '<React.Group>', '<React.Wrapper>', '<React.Container>'], correctOption: 0 },
    { id: 18, question: 'React ilovalarida global asinxron server ma\'lumotlarini boshqarishda eng mashhur vositalardan biri qaysi?', options: ['TanStack Query (React Query)', 'Lodash', 'Webpack', 'Babel'], correctOption: 0 },
    { id: 19, question: 'Komponent ekrandan o\'chirilayotganda (unmount) tozalash amali qayerda bajariladi?', options: ['useEffect return funksiyasida', 'useState ichida', 'render() tashqarisida', 'Catch blokida'], correctOption: 0 },
    { id: 20, question: 'React 18 da kiritilgan avtomatik batching (bir nechta state larni bittada yangilash) nima beradi?', options: ['Ortiqcha re-renderlarni kamaytirib tezlikni oshiradi', 'Fayllarni kichraytiradi', 'CSS kodlarni avtomatik yozadi', 'Internet xarajatini tejaydi'], correctOption: 0 }
  ]
};

// ==========================================
// LOCAL STORAGE ORQALI PROGRESSNI BOSHQARISH
// ==========================================

const getStorageKey = (courseSlug, userId = 'guest') => `runcode_module_quiz_${courseSlug}_${userId}`;

export const getCourseQuizProgress = (courseSlug, userId = 'guest') => {
  try {
    const raw = localStorage.getItem(getStorageKey(courseSlug, userId));
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveCourseQuizResult = (courseSlug, moduleIndex, result, userId = 'guest') => {
  try {
    const key = getStorageKey(courseSlug, userId);
    const prev = getCourseQuizProgress(courseSlug, userId);
    const updated = {
      ...prev,
      [moduleIndex]: {
        passed: result.passed,
        score: result.score,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
        completedAt: new Date().toISOString()
      }
    };
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Quiz progress saqlanmadi:', e);
    return {};
  }
};

// Modul ochiq yoki qulflanganligini tekshirish
// 1-modul: har doim ochiq
// 2-modul: 1-modul darslari tugagan VA 1-modul oraliq testi topshirilgan (>=70%)
// 3-modul: 2-modul ochiq VA 2-modul darslari tugagan VA 2-modul oraliq testi topshirilgan
// 4-modul: 3-modul ochiq VA 3-modul darslari tugagan VA 3-modul oraliq testi topshirilgan
export const checkModuleAccess = (modules = [], courseSlug = 'html', userId = 'guest', userRole = 'user') => {
  if (userRole === 'admin') {
    // Admin uchun barcha modullar ochiq
    return modules.map(m => ({ ...m, isUnlocked: true }));
  }

  const quizProgress = getCourseQuizProgress(courseSlug, userId);

  let previousUnlocked = true;
  let previousPassedQuiz = true;

  return modules.map((mod, idx) => {
    const modNum = idx + 1;

    if (modNum === 1) {
      // 1-modul har doim ochiq
      const hasCompletedLessons = mod.isCompleted;
      const hasPassedQuiz = quizProgress[1]?.passed || false;
      previousPassedQuiz = hasCompletedLessons && hasPassedQuiz;
      return {
        ...mod,
        isUnlocked: true,
        hasCompletedLessons,
        hasPassedQuiz,
        needsQuiz: hasCompletedLessons && !hasPassedQuiz
      };
    }

    // Keyingi modullar (2, 3, 4)
    // Ochilishi uchun oldingi modul darslari tugashi va oraliq testi o'tilgan bo'lishi kerak!
    const isUnlocked = previousUnlocked && previousPassedQuiz;
    const hasCompletedLessons = isUnlocked && mod.isCompleted;
    const hasPassedQuiz = isUnlocked && (quizProgress[modNum]?.passed || false);

    previousUnlocked = isUnlocked;
    previousPassedQuiz = hasCompletedLessons && hasPassedQuiz;

    return {
      ...mod,
      isUnlocked,
      hasCompletedLessons,
      hasPassedQuiz,
      needsQuiz: isUnlocked && hasCompletedLessons && !hasPassedQuiz
    };
  });
};
