export const COURSE_STATIC_INFO = {
  html: {
    title: 'HTML Dasturlash Asoslari',
    shortName: 'HTML',
    category: 'Foundation',
    level: 'Boshlang\'ich',
    duration: '8 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: false,
    is_premium: false,
    description: 'HTML to\'liq kurs o\'zbek tilida. Web sahifalarning asosi, semantik strukturasi, formlar, multimedia elementlari va amaliy loyihalar barchasi bitta kursda va mutlaqo bepul. O\'zingizning birinchi web sahifangizni yarating va uni internetga joylashni o\'rganing.',
    techTags: ['HTML5', 'Semantik Teglar', 'Formlar & Input', 'Multimedia', 'SEO Asoslari', 'Web Standartlar', 'Portfolio Loyiha'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. HTML Kirish va Asoslar',
        lessons: [
          '01-Dars: Kirish — Kompyuter, Editor, Browser',
          '02-Dars: HTMLga Kirish va Asosiy Tuzilma',
          '03-Dars: Tag lar va Attribute lar',
          '04-Dars: HTMLdagi Strukturaviy Elementlar'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Amaliy Konstruksiyalar',
        lessons: [
          '05-Dars: Media Elementlari va Multimedia Content',
          '06-Dars: Link lar va Navigation',
          '07-Dars: Ro\'yxatlar — <ol>, <ul>, <dl>',
          '08-Dars: Jadvallar (Tables)'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Loyiha va Komponentlar',
        lessons: [
          '09-Dars: HTML Forms va Input Elementlar',
          '10-Dars: HTML Best Practices va SEO'
        ]
      }
    ]
  },
  css: {
    title: 'CSS va Zamonaviy Dizayn',
    shortName: 'CSS',
    category: 'Frontend',
    level: 'O\'rta daraja',
    duration: '14 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: false,
    is_premium: true,
    description: 'CSS3 va zamonaviy web dizayn sirlari. Flexbox, CSS Grid, animatsiyalar, media so\'rovlar (responsiv dizayn) hamda BEM metodologiyasini professional darajada o\'rganing. Har qanday qurilma (smartfon, planshet, noutbuk) uchun moslashuvchan interfeyslar yarating.',
    techTags: ['CSS3', 'Flexbox', 'CSS Grid', 'Animatsiyalar', 'Media Queries', 'Responsiv Dizayn', 'BEM', 'UI Dizayn'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. CSS Asoslari va Selektorlar',
        lessons: [
          '01-Dars: CSSga Kirish va Sintaksis',
          '02-Dars: Ranglar, Shriftlar va Box Model',
          '03-Dars: Display xususiyatlari',
          '04-Dars: Position va Z-Index'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Flexbox Joylashuvi',
        lessons: [
          '05-Dars: Flex Container va Elementlar',
          '06-Dars: Flex Direction, Justify va Align',
          '07-Dars: Flex Wrap va Amaliy Menyu Loyihasi'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. CSS Grid va Layout',
        lessons: [
          '08-Dars: CSS Grid Asoslari',
          '09-Dars: Grid Template Columns va Rows',
          '10-Dars: Murakkab Dashboard Qolipi'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. Responsivlik va Animatsiyalar',
        lessons: [
          '11-Dars: Media Queries va Mobile-First',
          '12-Dars: Transition va Keyframes Animatsiyalari',
          '13-Dars: BEM Metodologiyasi va Portfolio Loyihasi'
        ]
      }
    ]
  },
  javascript: {
    title: 'JavaScript To\'liq Kurs',
    shortName: 'JavaScript',
    category: 'Frontend',
    level: 'Murakkab',
    duration: '24 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: false,
    is_premium: true,
    description: 'JavaScript dasturlash tilini noldan professional darajagacha o\'rganing. O\'zgaruvchilar, funksiyalar, DOM manipulyatsiya, hodisalar (Events), asinxron dasturlash (Promises, Async/Await), OOP hamda Event Loop mexanizmi amaliy loyihalar bilan to\'liq yoritilgan.',
    techTags: ['JavaScript ES6+', 'DOM', 'Events', 'Asinxron JS', 'Promises', 'Async/Await', 'OOP', 'Event Loop', 'Fetch API'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. JS Asoslari va Tiplar',
        lessons: [
          '01-Dars: JSga Kirish va O\'zgaruvchilar',
          '02-Dars: Ma\'lumot turlari va Operatorlar',
          '03-Dars: Shart operatorlari va Tsikllar',
          '04-Dars: Funksiyalar va Arrow Functions'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. DOM va Hodisalar',
        lessons: [
          '05-Dars: DOM Selektorlari',
          '06-Dars: Elementlar yaratish va Hodisalarni Tinglash',
          '07-Dars: Forma bilan ishlash va Validatsiya',
          '08-Dars: Interaktiv Todo-List Loyihasi'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Asinxron Dasturlash',
        lessons: [
          '09-Dars: Asinxronlik va SetTimeout',
          '10-Dars: Promise lar bilan ishlash',
          '11-Dars: Async / Await va Fetch API',
          '12-Dars: Ob-havo Ilovasi (Real API Loyihasi)'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. Ilg\'or Mavzular',
        lessons: [
          '13-Dars: OOP va Sinflar (Classes)',
          '14-Dars: Event Loop va Xotirani Boshqarish',
          '15-Dars: Yakuniy Amaliy Loyiha'
        ]
      }
    ]
  },
  react: {
    title: 'React.js Ekotizimi',
    shortName: 'React',
    category: 'Frontend',
    level: 'Murakkab',
    duration: '20 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: false,
    is_premium: true,
    description: 'Eng ommabop frontend kutubxonasi — React.js ni chuqur o\'rganing. Virtual DOM, JSX sintaksisi, barcha asosiy va custom Hooklar (useState, useEffect, useMemo, useCallback), React Router, Context API va server bilan integratsiya orqali real loyihalar yarating.',
    techTags: ['React 18', 'JSX', 'Hooks', 'Custom Hooks', 'React Router', 'Context API', 'Axios', 'State Management'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. React Asoslari va JSX',
        lessons: [
          '01-Dars: React Nima va Virtual DOM',
          '02-Dars: Vite orqali Loyiha O\'rnatish',
          '03-Dars: JSX Sintaksisi va Komponentlar',
          '04-Dars: Props va Ma\'lumot uzatish'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Asosiy Hooklar',
        lessons: [
          '05-Dars: useState Hooki va Holat',
          '06-Dars: useEffect va Lifecycle',
          '07-Dars: Ro\'yxatlar va Kalitlar (Keys)',
          '08-Dars: Formalar va Boshqariladigan Komponentlar'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Marshrutlash va Global Holat',
        lessons: [
          '09-Dars: React Router DOM',
          '10-Dars: useContext va Context API',
          '11-Dars: Custom Hooklar Yaratish'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. Real Amaliy Loyiha',
        lessons: [
          '12-Dars: Axios bilan Backendga Ulanish',
          '13-Dars: To\'liq E-Commerce SPA Ilovasi'
        ]
      }
    ]
  },
  node: {
    title: 'Node.js & Express.js Backend',
    shortName: 'Node.js',
    category: 'Backend',
    level: 'O\'rta daraja',
    duration: '24 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'Server dasturlash asoslari, Node.js asinxron arxitekturasi va Express.js freymvorki. RESTful API arxitekturasi, Middleware tizimi, JWT orqali foydalanuvchilarni autentifikatsiya qilish, PostgreSQL ma\'lumotlar bazasi va server xavfsizligi.',
    techTags: ['Node.js', 'Express.js', 'REST API', 'PostgreSQL', 'JWT', 'Middleware', 'Bcrypt', 'Server Arxitekturasi'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. Node.js Asoslari va Muhit',
        lessons: [
          '01-Dars: Node.js Runtime va Event Loop',
          '02-Dars: NPM va Paketlar bilan ishlash',
          '03-Dars: Fayllar Tizimi (FS moduli)',
          '04-Dars: HTTP Server Asoslari'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Express.js va RESTful API',
        lessons: [
          '05-Dars: Express Routing va Controllerlar',
          '06-Dars: Custom Middlewarelar',
          '07-Dars: RESTful API Standartlari',
          '08-Dars: Fayl yuklash (Multer)'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. PostgreSQL va Ma\'lumotlar Bazasi',
        lessons: [
          '09-Dars: PostgreSQLga Ulanish (pg-pool)',
          '10-Dars: CRUD Operatsiyalari va Relyatsiyalar',
          '11-Dars: SQL Injectiondan Himoyalanish'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. Xavfsizlik, JWT va Deploy',
        lessons: [
          '12-Dars: Parollarni Shifrlash (Bcrypt)',
          '13-Dars: JWT Token va Himoyalangan Marshrutlar',
          '14-Dars: Serverni Productionga Chiqarish'
        ]
      }
    ]
  },
  next: {
    title: 'Next.js 15 Server Components',
    shortName: 'Next.js',
    category: 'Full-Stack',
    level: 'Murakkab',
    duration: '20 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'Zamonaviy React freymvorki — Next.js 15. Yangi App Router arxitekturasi, Server Components va Server Actions, SSR (Server-Side Rendering), SSG, SEO optimallashtirish va to\'liq Full-Stack ilovalarni yaratish.',
    techTags: ['Next.js 15', 'App Router', 'Server Components', 'Server Actions', 'SSR & SSG', 'SEO', 'Full-Stack'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. Next.js 15 va App Router',
        lessons: [
          '01-Dars: Next.js Nima va Nega Kerak?',
          '02-Dars: App Router Papkalar Strukturasi',
          '03-Dars: Layouts va Pages Konseptsiyasi',
          '04-Dars: Dynamic Routes va Parametrlar'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Server vs Client Komponentlar',
        lessons: [
          '05-Dars: React Server Components (RSC)',
          '06-Dars: "use client" Qachon Ishlatiladi?',
          '07-Dars: Ma\'lumotlarni Kesh Lash (Caching)',
          '08-Dars: Server Actions orqali Formani Jo\'natish'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. SEO va Optimizatsiya',
        lessons: [
          '09-Dars: Metadata va Open Graph (SEO)',
          '10-Dars: Rasm va Shriftlar Optimizatsiyasi',
          '11-Dars: Full-Stack Amaliy Loyiha'
        ]
      }
    ]
  },
  vue: {
    title: 'Vue.js 3 & Pinia Ekotizimi',
    shortName: 'Vue.js',
    category: 'Frontend',
    level: 'O\'rta daraja',
    duration: '18 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'Vue.js 3 ning zamonaviy imkoniyatlari: Composition API, reaktivlik mexanizmi, Single File Components, Pinia orqali global holatni boshqarish, Vue Router va yuqori tezlikdagi SPA ilovalar yaratish.',
    techTags: ['Vue 3', 'Composition API', 'Pinia', 'Vue Router', 'Vite', 'Reaktivlik', 'SPA Ilovalar'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. Vue 3 Asoslari',
        lessons: [
          '01-Dars: Vue 3 Ekosistemasi',
          '02-Dars: Template Sintaksisi va Direktivalar',
          '03-Dars: Reaktivlik — ref() va reactive()',
          '04-Dars: Computed va Watchers'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Komponentlar va Props',
        lessons: [
          '05-Dars: Single File Components (SFC)',
          '06-Dars: Props va Emits Mexanizmi',
          '07-Dars: Slots va Dinamik Komponentlar'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Pinia va Vue Router',
        lessons: [
          '08-Dars: Vue Router bilan Sahifalash',
          '09-Dars: Pinia Store orqali State Management',
          '10-Dars: Yakuniy Amaliy Dashboard Loyihasi'
        ]
      }
    ]
  },
  typescript: {
    title: 'TypeScript Professional',
    shortName: 'TypeScript',
    category: 'Frontend / Backend',
    level: 'O\'rta daraja',
    duration: '16 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'JavaScript loyihalarida qat\'iy tiplashtirish va toza arxitektura. Primitive va murakkab tiplar, interfeyslar, Generics, Utility Types, React va Node.js bilan birgalikda TypeScriptdan samarali foydalanish.',
    techTags: ['TypeScript', 'Types & Interfaces', 'Generics', 'Utility Types', 'React + TypeScript', 'Xavfsiz Kod'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. TypeScript Asoslari',
        lessons: [
          '01-Dars: Nega TypeScript Kerak?',
          '02-Dars: Primitive Tiplar va Tip Aniqlash',
          '03-Dars: Funksiyalar va Return Tiplar',
          '04-Dars: Union va Intersection Tiplar'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Interfeyslar va Obyektlar',
        lessons: [
          '05-Dars: Interfaces vs Type Aliases',
          '06-Dars: Obyektlarni Tiplash va Readonly',
          '07-Dars: Enums va Literal Tiplar'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Generics va Frameworklar',
        lessons: [
          '08-Dars: Generics Nima va Qanday Ishlaydi?',
          '09-Dars: Utility Types (Partial, Pick, Omit)',
          '10-Dars: React Komponentlarida TypeScript'
        ]
      }
    ]
  },
  ai: {
    title: 'AI Bilan Mukammal Ishlash',
    shortName: 'Sun\'iy Intellekt',
    category: 'Sun\'iy Intellekt',
    level: 'Zamonaviy',
    duration: '18 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'Sun\'iy intellekt vositalari (ChatGPT, Claude, GitHub Copilot, Cursor AI, Midjourney) yordamida dasturlash va muhandislik unumdorligini 10 barobarga oshirish. Prompt engineering, AI agentlar, avtomatlashtirish va kodni tez va sifatli yaratish sirlari.',
    techTags: ['ChatGPT', 'Claude AI', 'GitHub Copilot', 'Cursor AI', 'Prompt Engineering', 'Midjourney', 'AI Agents', 'Avtomatlashtirish'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. Zamonaviy AI Vositalari va Kirish',
        lessons: [
          '01-Dars: Dasturlashda AI Inqilobi va Ekosistema',
          '02-Dars: ChatGPT va Claude: Imkoniyatlar va Farqlar',
          '03-Dars: Prompt Engineering Asoslari va Qoidalari',
          '04-Dars: Kontekstni To\'g\'ri Berish va Prompt Strukturasi'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Kodlashda AI: GitHub Copilot & Cursor AI',
        lessons: [
          '05-Dars: Cursor IDE — AI Bilan Kod Yozish Muhiti',
          '06-Dars: GitHub Copilot: Avtomatik Kod Yozish va Chat',
          '07-Dars: Murakkab Funksiyalarni Generatsiya Qilish',
          '08-Dars: Kod Refaktoringi va Buglarni Qidirish'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Testlash, Hujjatlashtirish va Vizual AI',
        lessons: [
          '09-Dars: Unit Testlar va Integratsion Testlarni Yozdirish',
          '10-Dars: Loyihaga README va Dokumentatsiyalarni Tayyorlash',
          '11-Dars: Midjourney va DALL-E orqali UI/UX Assetlar Yaratish'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. AI Agentlar va Real Loyiha',
        lessons: [
          '12-Dars: Autonomous AI Agentlar va API Integratsiyasi',
          '13-Dars: AI Yordamida Noldan Full-Stack Ilova Qurish'
        ]
      }
    ]
  }
};
