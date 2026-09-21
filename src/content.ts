import jakubPhoto from './img/jakub-wasilewski.jpg'

export type Lang = 'pl' | 'en'
export type LS = Record<Lang, string>

/* ------------------------------------------------------------- Portfolio */

export type Project = {
  id: string
  name: string
  category: 'web' | 'mobile' | 'commerce' | 'landing'
  year: string
  image: string
  color: string
  tagline: LS
  role: LS
  stack: string[]
  highlights: LS[]
  about: LS
  liveUrl?: string
  repoUrl?: string
}

export const categories: { key: 'all' | Project['category']; label: LS }[] = [
  { key: 'all', label: { pl: 'Wszystko', en: 'All' } },
  { key: 'web', label: { pl: 'Aplikacje web', en: 'Web apps' } },
  { key: 'mobile', label: { pl: 'Mobile', en: 'Mobile' } },
  { key: 'commerce', label: { pl: 'E-commerce', en: 'E-commerce' } },
  { key: 'landing', label: { pl: 'Landing', en: 'Landing' } },
]

const img = (id: string, w = 900, h = 640) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`

export const projects: Project[] = [
  {
    id: 'halo',
    name: 'Halo Analytics',
    category: 'web',
    year: '2025',
    image: img('1551288049-bebda4e38f71'),
    color: '#4f46e5',
    tagline: {
      pl: 'Pulpit analityczny SaaS dla zespołów produktowych.',
      en: 'A SaaS analytics dashboard for product teams.',
    },
    role: { pl: 'Projekt i front-end', en: 'Design & front-end' },
    stack: ['React', 'TypeScript', 'Tailwind', 'Recharts'],
    highlights: [
      {
        pl: 'Interaktywny onboarding ze „spotlight” samouczkiem prowadzącym po funkcjach.',
        en: 'Interactive onboarding with a spotlight tour guiding through features.',
      },
      {
        pl: 'Widoki tabelaryczne renderujące 50k wierszy bez zacięć dzięki wirtualizacji.',
        en: 'Table views rendering 50k rows smoothly via virtualization.',
      },
      { pl: 'W pełni dostępny — WCAG AA, obsługa klawiatury.', en: 'Fully accessible — WCAG AA, keyboard support.' },
    ],
    about: {
      pl: 'Celem było uprościć wdrożenie nowych użytkowników do złożonego narzędzia analitycznego. Zaprojektowaliśmy system komponentów i dopięliśmy wydajność, aby ciężkie widoki działały płynnie także na słabszym sprzęcie.',
      en: 'The goal was to simplify onboarding into a complex analytics tool. We designed the component system and tuned performance so heavy views stay smooth even on modest hardware.',
    },
    liveUrl: 'https://example.com/halo',
    repoUrl: 'https://github.com/example/halo'
  },
  {
    id: 'fjord',
    name: 'Fjord',
    category: 'mobile',
    year: '2024',
    image: img('1627542557169-5ed71c66ed85'),
    color: '#0f9d6a',
    tagline: {
      pl: 'Aplikacja mobilna do budżetowania z podejściem mobile-first.',
      en: 'A mobile-first personal budgeting app.',
    },
    role: { pl: 'Projekt produktu i wdrożenie', en: 'Product design & build' },
    stack: ['React Native', 'Expo', 'Reanimated', 'SQLite'],
    highlights: [
      { pl: 'Gesty i mikroanimacje 60 fps na urządzeniach niskiej półki.', en: '60fps gestures and micro-animations on low-end devices.' },
      { pl: 'Tryb offline-first z synchronizacją w tle.', en: 'Offline-first with background sync.' },
      { pl: 'Kategoryzacja transakcji wspierana heurystyką.', en: 'Heuristic-assisted transaction categorization.' },
    ],
    about: {
      pl: 'Projekt od zera pod kątem kciuka — cała nawigacja w zasięgu jednej ręki. Największym wyzwaniem była płynność animacji przy jednoczesnej pracy offline.',
      en: 'Designed thumb-first from scratch — all navigation within one-handed reach. The main challenge was keeping animations fluid while working fully offline.',
    },
  },
  {
    id: 'atelier',
    name: 'Atelier',
    category: 'commerce',
    year: '2024',
    image: img('1539278383962-a7774385fa02'),
    color: '#d97706',
    tagline: {
      pl: 'Minimalistyczny sklep modowy z konfiguratorem produktu.',
      en: 'A minimalist fashion store with a product configurator.',
    },
    role: { pl: 'Front-end i integracja', en: 'Front-end & integration' },
    stack: ['Next.js', 'Shopify', 'Framer Motion'],
    highlights: [
      { pl: 'Konwersja wyższa o 23% po przeprojektowaniu ścieżki zakupu.', en: '23% higher conversion after redesigning the checkout path.' },
      { pl: 'LCP poniżej 1,2 s dzięki obrazom next/image i ISR.', en: 'Sub-1.2s LCP via next/image and ISR.' },
      { pl: 'Konfigurator wariantów w czasie rzeczywistym.', en: 'Real-time variant configurator.' },
    ],
    about: {
      pl: 'Sklep stawia na zdjęcia produktu i spokojną typografię. Skupiliśmy się na szybkości i płynnych przejściach, aby zakupy przypominały przeglądanie lookbooka.',
      en: 'The store leans on product photography and calm typography. We focused on speed and smooth transitions so shopping feels like browsing a lookbook.',
    },
  },
  {
    id: 'nova',
    name: 'Nova',
    category: 'landing',
    year: '2025',
    image: img('1635776063328-153b13e3c245'),
    color: '#7c3aed',
    tagline: {
      pl: 'Strona-wizytówka studia kreatywnego z animowanym hero.',
      en: 'A creative studio landing page with an animated hero.',
    },
    role: { pl: 'Projekt i animacje', en: 'Design & motion' },
    stack: ['Astro', 'GSAP', 'WebGL'],
    highlights: [
      { pl: 'Płynny scrollytelling sterujący sceną WebGL.', en: 'Smooth scrollytelling driving a WebGL scene.' },
      { pl: 'Ocena 100/100 w Lighthouse na mobile.', en: '100/100 Lighthouse score on mobile.' },
      { pl: 'Respektuje prefers-reduced-motion.', en: 'Respects prefers-reduced-motion.' },
    ],
    about: {
      pl: 'Wyzwaniem było połączenie efektownej animacji z doskonałą wydajnością na telefonach. Ciężkie efekty ładują się warunkowo i wyłączają dla użytkowników preferujących mniej ruchu.',
      en: 'The challenge was pairing bold motion with excellent mobile performance. Heavy effects load conditionally and switch off for users who prefer less motion.',
    },
  },
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'mobile',
    year: '2023',
    image: img('1695048064952-44b984f2af6d'),
    color: '#e11d48',
    tagline: {
      pl: 'Aplikacja zdrowotna z pierścieniami aktywności i wykresami.',
      en: 'A health app with activity rings and charts.',
    },
    role: { pl: 'Projekt i front-end', en: 'Design & front-end' },
    stack: ['React Native', 'Skia', 'HealthKit'],
    highlights: [
      { pl: 'Niestandardowe wykresy rysowane na Skia dla płynności.', en: 'Custom charts drawn on Skia for fluidity.' },
      { pl: 'Integracja z HealthKit i Google Fit.', en: 'HealthKit and Google Fit integration.' },
      { pl: 'Haptyka wzmacniająca informację zwrotną.', en: 'Haptics reinforcing feedback.' },
    ],
    about: {
      pl: 'Dane zdrowotne bywają przytłaczające — postawiliśmy na czytelną hierarchię i jeden akcent koloru na ekran, by użytkownik od razu wiedział, co jest ważne.',
      en: 'Health data can overwhelm — we leaned on clear hierarchy and one accent color per screen so users instantly know what matters.',
    },
  },
  {
    id: 'grid',
    name: 'Grid',
    category: 'web',
    year: '2023',
    image: img('1686061592689-312bbfb5c055'),
    color: '#0891b2',
    tagline: {
      pl: 'Open-source system projektowy i biblioteka komponentów.',
      en: 'An open-source design system and component library.',
    },
    role: { pl: 'Autor i utrzymanie', en: 'Author & maintainer' },
    stack: ['React', 'TypeScript', 'Radix', 'Storybook'],
    highlights: [
      { pl: 'Ponad 60 dostępnych komponentów z tokenami motywu.', en: '60+ accessible components with theme tokens.' },
      { pl: '1,4k gwiazdek na GitHubie i aktywna społeczność.', en: '1.4k GitHub stars and an active community.' },
      { pl: 'Tryb jasny i ciemny sterowany zmiennymi CSS.', en: 'Light/dark mode driven by CSS variables.' },
    ],
    about: {
      pl: 'Zbudowaliśmy Grid, aby przyspieszyć start nowych projektów. Nacisk położyliśmy na dostępność i spójne tokeny, dzięki czemu motywowanie sprowadza się do zmiany kilku zmiennych.',
      en: 'We built Grid to speed up new projects. We emphasized accessibility and consistent tokens, so theming comes down to changing a few variables.',
    },
  },
]

/* ---------------------------------------------------------- UI strings */

export const t = {
  brand: { pl: 'SW Development', en: 'SW Development' },
  role: { pl: 'Studio: 2 developerów + analityk biznesowy', en: 'Studio: 2 developers + business analyst' },
  nav: {
    work: { pl: 'Prace', en: 'Work' },
    about: { pl: 'O nas', en: 'About us' },
    testimonials: { pl: 'Opinie', en: 'Reviews' },
    contact: { pl: 'Kontakt', en: 'Contact' },
  },
  available: { pl: 'Dostępni do współpracy', en: 'Available for work' },
  heroTitle: {
    pl: 'Projektujemy i budujemy szybkie, dostępne produkty cyfrowe.',
    en: 'We design and build fast, accessible digital products.',
  },
  heroBody: {
    pl: 'SW Development to trzyosobowe studio: dwoje developerów oraz analityk biznesowy, który zbiera kontekst aplikacji i wspiera proces. Tworzymy aplikacje web, produkty mobilne i strony — od pierwszej rozmowy po bezpieczne wdrożenie.',
    en: 'SW Development is a three-person studio: two developers and a business analyst who gathers app context and supports the process. We create web apps, mobile products, and websites — from the first conversation to a secure launch.',
  },
  cta: { pl: 'Zobacz prace', en: 'View work' },
  ctaContact: { pl: 'Napisz do nas', en: 'Get in touch' },
  downloadCv: { pl: 'Pobierz CV', en: 'Download CV' },
  workTitle: { pl: 'Wybrane realizacje', en: 'Selected work' },
  workCount: { pl: 'projektów', en: 'projects' },
  caseStudy: { pl: 'Case study', en: 'Case study' },
  viewLive: { pl: 'Zobacz na żywo', en: 'View live' },
  viewCode: { pl: 'Kod', en: 'Code' },
  roleLabel: { pl: 'Rola', en: 'Role' },
  yearLabel: { pl: 'Rok', en: 'Year' },
  stackLabel: { pl: 'Technologie', en: 'Stack' },
  highlightsLabel: { pl: 'Czym się wyróżnia', en: 'What makes it stand out' },
  aboutLabel: { pl: 'O projekcie', en: 'About the project' },
  contactTitle: { pl: 'Zbudujmy coś razem', en: 'Let’s build something together' },
  contactBody: {
    pl: 'Szukasz zespołu do zaprojektowania lub zbudowania produktu? Chętnie porozmawiamy.',
    en: 'Looking for a team to design or build a product? We’d love to talk.',
  },
  email: { pl: 'Napisz e-mail', en: 'Send an email' },
  close: { pl: 'Zamknij', en: 'Close' },
  aboutSectionTitle: { pl: 'O nas', en: 'About us' },
  aboutSectionBody: {
    pl: 'W SW Development działamy jako trzyosobowe studio: dwoje developerów oraz analityk biznesowy. Łączymy projektowanie, kodowanie i sprawne zbieranie kontekstu aplikacji, aby interfejsy nie tylko dobrze wyglądały, ale też działały bezbłędnie.',
    en: 'At SW Development we work as a three-person studio: two developers and a business analyst. We combine design, code, and efficient application discovery so interfaces not only look good, but work flawlessly.'
  },
  testimonialsTitle: { pl: 'Opinie', en: 'Testimonials' },
  testimonialsBody: {
    pl: 'Mieliśmy przyjemność współpracować z niesamowitymi ludźmi i zespołami. Oto co niektórzy z nich mają do powiedzenia.',
    en: 'We’ve had the pleasure of working with some amazing people and teams. Here’s what a few of them have to say.'
  },
} as const

/* ---------------------------------------------------------- Services / Process */

export type ServiceEntry = {
  id: string;
  title: LS;
  description: LS;
  skills: string[];
}

/** Icon keys drawn by `faceIcons` on the flipping business card. */
export type FaceIcon =
  | 'figma'
  | 'motion'
  | 'layers'
  | 'key'
  | 'bolt'
  | 'shield'
  | 'chart'
  | 'flow'
  | 'target';

export type StackItem = {
  icon: FaceIcon;
  label: string | LS;
}

export type TeamMember = {
  name: LS;
  role: LS;
  education: LS;
  bio: LS;
  image: string;
  /** Picks the hue and the background texture of this person's card face. */
  theme: 'design' | 'security' | 'analysis';
  /** Three tools or methods this person is known for, shown on the card. */
  stack: StackItem[];
}

export const teamMembers: TeamMember[] = [
  {
    name: { pl: 'Mikołaj Sitek', en: 'Mikołaj Sitek' },
    role: { pl: 'UX/UI & Front-end', en: 'UX/UI & Front-end' },
    education: { pl: 'Edukacja: do uzupełnienia', en: 'Education: to be added' },
    bio: {
      pl: 'Łączy myślenie produktowe z dbałością o każdy detal interfejsu.',
      en: 'Combines product thinking with care for every interface detail.'
    },
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
    theme: 'design',
    stack: [
      { icon: 'figma', label: 'Figma' },
      { icon: 'motion', label: 'Framer Motion' },
      { icon: 'layers', label: { pl: 'Design system', en: 'Design system' } }
    ]
  },
  {
    name: { pl: 'Jakub Wasilewski', en: 'Jakub Wasilewski' },
    role: { pl: 'Development & Security', en: 'Development & Security' },
    education: { pl: 'Edukacja: do uzupełnienia', en: 'Education: to be added' },
    bio: {
      pl: 'Buduje szybkie, stabilne aplikacje i dba o ich bezpieczeństwo.',
      en: 'Builds fast, reliable applications and keeps them secure.'
    },
    image: jakubPhoto,
    theme: 'security',
    stack: [
      { icon: 'key', label: 'JWT' },
      { icon: 'bolt', label: { pl: 'Anty-DDoS', en: 'Anti-DDoS' } },
      { icon: 'shield', label: 'OWASP' }
    ]
  },
  {
    name: { pl: 'Wojciech Nowicki', en: 'Wojciech Nowicki' },
    role: { pl: 'Discovery & Kontakt z klientem', en: 'Discovery & Client Contact' },
    education: { pl: 'Edukacja: do uzupełnienia', en: 'Education: to be added' },
    bio: {
      pl: 'Zbiera wymagania i porządkuje kontekst aplikacji, dbając o stały kontakt z klientem na każdym etapie.',
      en: 'Gathers requirements and organizes app context, keeping the client in close contact at every stage.'
    },
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop',
    theme: 'analysis',
    stack: [
      { icon: 'target', label: 'Discovery' },
      { icon: 'flow', label: 'BPMN' },
      { icon: 'chart', label: { pl: 'Wskaźniki KPI', en: 'KPI tracking' } }
    ]
  }
]

export const services: ServiceEntry[] = [
  {
    id: 'design',
    title: { pl: 'UX/UI Design & Strategia', en: 'UX/UI Design & Strategy' },
    description: { 
      pl: 'Projektujemy interfejsy od makiet po pixel-perfect design. Proaktywnie proponujemy innowacyjne rozwiązania, ale zawsze uważnie słuchamy klienta, aby odpowiedzieć na realne potrzeby biznesowe.', 
      en: 'We design interfaces from wireframes to pixel-perfect mockups. We proactively propose innovative solutions, but always listen closely to the client to answer real business needs.' 
    },
    skills: ['Figma', 'Prototyping', 'Design Systems', 'Workshops', 'User Research']
  },
  {
    id: 'development',
    title: { pl: 'Development & Bezpieczeństwo', en: 'Development & Security' },
    description: { 
      pl: 'Wdrażamy projekty pisząc czysty i wydajny kod. Zabezpieczamy aplikacje na wielu płaszczyznach – dbamy o to, by były nie tylko szybkie i piękne, ale przede wszystkim odporne na zagrożenia.', 
      en: 'We bring designs to life with clean, efficient code. We secure applications on multiple levels – ensuring they are not only fast and beautiful, but above all, resilient to threats.' 
    },
    skills: ['React', 'Next.js', 'TypeScript', 'Web Security', 'Framer Motion']
  },
  {
    id: 'agent',
    title: { pl: 'Nasz agent: discovery aplikacji', en: 'Our agent: app discovery' },
    description: {
      pl: 'Nasz agent zbiera i porządkuje informacje o aplikacji: cele, użytkowników, istniejące funkcje i ograniczenia. Dzięki temu szybciej zamieniamy brief w konkretne decyzje produktowe i techniczne.',
      en: 'Our agent gathers and organizes application context: goals, users, existing features, and constraints. This lets us turn a brief into clear product and technical decisions faster.'
    },
    skills: ['App Audit', 'Requirements', 'User Flows', 'Documentation', 'Discovery']
  }
]

export type ProcessStep = {
  id: string;
  title: LS;
  description: LS;
}

export const processSteps: ProcessStep[] = [
  {
    id: 'requirements',
    title: { pl: 'Zbieramy wymagania', en: 'We gather requirements' },
    description: {
      pl: 'Rozmawiamy o celach, użytkownikach, ograniczeniach i priorytetach aplikacji.',
      en: 'We discuss the app’s goals, users, constraints, and priorities.'
    }
  },
  {
    id: 'wireframes',
    title: { pl: 'Tworzymy makiety', en: 'We create wireframes' },
    description: {
      pl: 'Przekładamy ustalenia na architekturę informacji, przepływy i widoki UX/UI.',
      en: 'We turn decisions into information architecture, flows, and UX/UI screens.'
    }
  },
  {
    id: 'iterations',
    title: { pl: 'Dopracowujemy rozwiązanie', en: 'We refine the solution' },
    description: {
      pl: 'Zbieramy feedback, wprowadzamy poprawki i wspólnie zatwierdzamy kierunek.',
      en: 'We gather feedback, make refinements, and approve the direction together.'
    }
  },
  {
    id: 'build',
    title: { pl: 'Wdrażamy etapami', en: 'We build in sequence' },
    description: {
      pl: 'Implementujemy kolejne obszary w uporządkowanych, widocznych etapach.',
      en: 'We implement each area in clear, visible stages.'
    }
  },
  {
    id: 'contact',
    title: { pl: 'Pozostajemy w kontakcie', en: 'We stay in close contact' },
    description: {
      pl: 'Na bieżąco pokazujemy postęp, omawiamy decyzje i dbamy o bezpieczny start.',
      en: 'We share progress, discuss decisions, and ensure a safe launch.'
    }
  }
]

/* ------------------------------------------------------ Testimonials */

export type Testimonial = {
  name: string;
  role: LS;
  text: LS;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Anna Nowak',
    role: { pl: 'CEO, TechFlow', en: 'CEO, TechFlow' },
    text: { 
      pl: 'Współpraca z SW Development to czysta przyjemność. Doskonale zrozumieli nasze potrzeby i dostarczyli produkt, który zachwycił naszych użytkowników. Interfejs jest teraz niesamowicie intuicyjny.',
      en: 'Working with SW Development was a pure pleasure. They perfectly understood our needs and delivered a product that delighted our users. The interface is now incredibly intuitive.'
    },
    avatar: img('1494790108377-be9c29b29330', 200, 200)
  },
  {
    name: 'Jan Kowalski',
    role: { pl: 'Product Manager, Innovate', en: 'Product Manager, Innovate' },
    text: { 
      pl: 'Najlepszy proces design-to-code z jakim miałem do czynienia. Aplikacja wygląda i działa dokładnie tak, jak w projekcie, a wydajność na urządzeniach mobilnych przerosła moje oczekiwania.',
      en: 'The best design-to-code process I have ever experienced. The app looks and works exactly like the design, and mobile performance exceeded my expectations.'
    },
    avatar: img('1599566150163-29194dcaad36', 200, 200)
  },
  {
    name: 'Sarah Smith',
    role: { pl: 'Założycielka, Atelier', en: 'Founder, Atelier' },
    text: { 
      pl: 'Zmysł estetyczny zespołu połączony z umiejętnościami technicznymi to rzadkość. Nasz sklep internetowy nie tylko pięknie wygląda, ale też konwertuje zauważalnie lepiej niż wcześniej.',
      en: 'The team’s aesthetic sense combined with technical skills is a rarity. Our online store not only looks beautiful but also converts noticeably better than before.'
    },
    avatar: img('1438761681033-6461ffad8d80', 200, 200)
  }
]
