import jakubPhoto from './img/jakub-wasilewski.jpg'
import shotClinic from './img/clinic-calendar.jpg'
import shotTraining from './img/training-reports.jpg'
import shotGame from './img/party-game.jpg'
import shotChartScanner from './img/chart-scanner.jpg'
import shotMkCycling from './img/mkcycling.jpg'
import shotPixelBites from './img/pixel-bites.jpg'
import shotRestaurantSystem from './img/restaurant-system.jpg'
import shotBistro from './img/bistro.jpg'
import shotIceCream from './img/lody.jpg'
import shotPizza from './img/pizza.jpg'
import shotSplitDeBill from './img/splitdebill.jpg'
import shotExplorePoland from './img/explore-poland.jpg'
import mikolajPhoto from './img/mikolaj-sitek.jpg'

export type Lang = 'pl' | 'en'
export type LS = Record<Lang, string>

/* ------------------------------------------------------------- Portfolio */

export type Project = {
  id: string
  name: LS
  category: 'web' | 'mobile' | 'commerce' | 'landing'
  year: string
  /** Empty for projects whose preview is blocked; the card draws a locked cover. */
  image: string
  /**
   * 'private' hides the preview entirely, 'ongoing' marks work still in flight,
   * 'forSale' marks a finished product we can deploy for another client.
   */
  status?: 'private' | 'ongoing' | 'forSale'
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
    id: 'chart-scanner',
    name: { pl: 'Skaner Biznesowy', en: 'Business Scanner' },
    category: 'mobile',
    year: '2026',
    image: shotChartScanner,
    color: '#0ea5e9',
    tagline: {
      pl: 'Zdjęcie wykresu z dowolnej platformy, a w kilka sekund analiza AI: trend, formacja i poziomy cenowe.',
      en: 'A photo of a chart from any platform, and seconds later an AI read: trend, pattern and price levels.',
    },
    role: { pl: 'Projekt, aplikacja i backend', en: 'Design, app & backend' },
    stack: ['React Native + Expo', 'Expo Router', 'TypeScript', 'Firebase (Auth, Firestore, Functions, Storage)', 'Gemini 2.5', 'RevenueCat', 'Jest'],
    highlights: [
      {
        pl: 'Analiza wykresów akcji, ETF-ów, krypto, walut i surowców: trend, formacja techniczna, sugerowane wejście, cel i obrona oraz pewność analizy w procentach.',
        en: 'Chart analysis for stocks, ETFs, crypto, currencies and commodities: trend, technical pattern, suggested entry, target and stop, plus a confidence score.',
      },
      {
        pl: 'Dziennik inwestycji ze skutecznością, średnim zyskiem i seriami oraz asystent AI z symulatorem scenariuszy.',
        en: 'An investment journal with win rate, average gain and streaks, plus an AI assistant with a scenario simulator.',
      },
      {
        pl: 'Społeczność z kartami analiz i moderacją treści, a do tego subskrypcja PRO obsługiwana przez RevenueCat i Google Play.',
        en: 'A community of shared analysis cards with content moderation, and a PRO subscription handled through RevenueCat and Google Play.',
      },
    ],
    about: {
      pl: 'Aplikacja mobilna dla inwestorów, opublikowana w Google Play. Użytkownik robi zdjęcie wykresu z dowolnego serwisu, a model Gemini rozpoznaje, co na nim widać, i zwraca analizę z poziomami cenowymi. Logika wrażliwa na koszty i uprawnienia działa w Cloud Functions, nie w aplikacji, a dostęp do danych w Firestore pilnują reguły bazy. Do publikacji przygotowaliśmy też stronę z polityką prywatności i regulaminem, której wymaga sklep.',
      en: 'A mobile app for investors, published on Google Play. The user photographs a chart from any service, and a Gemini model reads it and returns an analysis with price levels. Logic that touches costs and permissions runs in Cloud Functions rather than in the app, and access to Firestore data is guarded by database rules. For the release we also shipped the privacy policy and terms site the store requires.',
    },
    liveUrl: 'https://play.google.com/store/apps/details?id=com.skanerbiznes.app',
  },
  {
    id: 'restaurant-system',
    name: { pl: 'La Maison Dorée — rezerwacje stolików', en: 'La Maison Dorée — table bookings' },
    category: 'web',
    year: '2026',
    image: shotRestaurantSystem,
    color: '#b8862f',
    tagline: {
      pl: 'Elegancka strona restauracji z rezerwacją, w której gość sam wybiera stolik na planie sali.',
      en: 'An elegant restaurant site with bookings where guests pick their own table on the floor plan.',
    },
    role: { pl: 'Projekt i wdrożenie', en: 'Design & build' },
    stack: ['React 18 + Vite', 'TypeScript', 'React Router', 'Supabase Edge Functions', 'Tailwind CSS', 'Motion'],
    highlights: [
      {
        pl: 'Rezerwacja w czterech krokach: termin, wybór stolika na planie sali, dane gościa i potwierdzenie.',
        en: 'Booking in four steps: date and time, a table picked on the floor plan, guest details and confirmation.',
      },
      {
        pl: 'Osobne widoki dla kelnera, managera i administratora.',
        en: 'Separate views for waiters, managers and administrators.',
      },
      {
        pl: 'Zapytania o wydarzenia prywatne, menu i galeria w jednej spójnej stylistyce.',
        en: 'Private event enquiries, menu and gallery in one consistent style.',
      },
    ],
    about: {
      pl: 'Strona restauracji fine dining połączona z rezerwacjami. Gość nie wypełnia formularza w ciemno, tylko widzi salę i wybiera konkretny stolik, a obsługa dostaje rezerwacje w swoim panelu. Dane o stolikach i rezerwacjach trafiają do Supabase przez funkcję brzegową.',
      en: 'A fine dining restaurant site wired to bookings. Guests do not fill in a blind form: they see the room and choose a specific table, while staff receive bookings in their own panel. Table and booking data reaches Supabase through an edge function.',
    },
    liveUrl: 'https://restaurant-design-ten.vercel.app/',
    repoUrl: 'https://github.com/Sitkowski01/restaurantDesign',
  },
  {
    id: 'dls',
    name: { pl: 'System grafikowy DLS', en: 'DLS scheduling system' },
    category: 'web',
    year: '2026',
    image: '',
    color: '#334155',
    status: 'private',
    tagline: {
      pl: 'Grafik pracy i flota pojazdów w jednym systemie, pisanym pod reguły firmy.',
      en: 'Staff scheduling and vehicle fleet in one system, built around a company’s rules.',
    },
    role: { pl: 'Analiza, backend i frontend', en: 'Analysis, backend & front-end' },
    stack: ['Angular 18', 'Tailwind CSS', 'Node + Express', 'MongoDB / Mongoose', 'Socket.IO', 'JWT', 'Playwright'],
    highlights: [
      {
        pl: 'Układanie grafiku na podstawie dyspozycyjności zgłaszanej przez pracowników, z ewidencją godzin i nieobecności.',
        en: 'Schedules built from availability submitted by staff, with hours and absences tracked alongside.',
      },
      {
        pl: 'Ewidencja floty: przypisania pojazdów, pojazdy rezerwowe, warsztat i statusy dzienne.',
        en: 'Fleet register: vehicle assignments, reserve vehicles, workshop flow and daily statuses.',
      },
      {
        pl: 'Aplikacja mobile-first z komunikacją w czasie rzeczywistym i uprawnieniami rozdzielonymi per rola.',
        en: 'A mobile-first app with real-time updates and permissions split per role.',
      },
    ],
    about: {
      pl: 'Wewnętrzny system dla firmy transportowej, w którym grafik pracy i zarządzanie flotą są jednym procesem, a nie dwoma osobnymi narzędziami. Zamiast uniwersalnego kalendarza aplikacja odwzorowuje reguły tej konkretnej firmy: sposób zbierania dyspozycyjności, zasady przydziału pojazdów, obieg zgłoszeń warsztatowych i rozliczanie czasu pracy. Projekt prywatny — podgląd i repozytorium pozostają niedostępne.',
      en: 'An internal system for a transport company where staffing and fleet management are one process rather than two separate tools. Instead of a generic calendar, the app encodes this company’s own rules: how availability is collected, how vehicles are assigned, how workshop tickets travel and how working time is settled. A private project — preview and repository stay closed.',
    },
  },
  {
    id: 'clinic-calendar',
    name: { pl: 'Kalendarz gabinetu', en: 'Clinic calendar' },
    category: 'mobile',
    year: '2026',
    image: shotClinic,
    color: '#4f46e5',
    status: 'forSale',
    tagline: {
      pl: 'PWA prowadząca cały gabinet: rezerwacje, karnety, kartoteka i rozliczenia.',
      en: 'A PWA running a whole clinic: bookings, passes, client records and billing.',
    },
    role: { pl: 'Projekt i wdrożenie', en: 'Design & build' },
    stack: ['React 18 + Vite', 'TypeScript', 'Supabase / PostgreSQL', 'Row Level Security', 'TanStack Query', 'Edge Functions (Deno)', 'Web Push', 'pgTAP', 'Vitest'],
    highlights: [
      {
        pl: 'Podwójna rezerwacja jest niemożliwa dzięki wykluczającemu indeksowi w bazie — nie ma wyścigu, który da się przegrać po stronie klienta.',
        en: 'Double booking is impossible thanks to an exclusion index in the database — there is no race the client could lose.',
      },
      {
        pl: 'Statystyki i rozliczenia liczone funkcjami SQL, więc liczba na ekranie i liczba w raporcie nie mogą się rozjechać.',
        en: 'Statistics and settlements are computed by SQL functions, so the number on screen and the number in the report cannot drift apart.',
      },
      {
        pl: 'Autoryzacja egzekwowana przez bazę (RLS na każdej tabeli), z osobną bramką na raporty finansowe i testami polityk w pgTAP.',
        en: 'Authorization enforced by the database (RLS on every table), with a separate gate on financial reports and policies tested in pgTAP.',
      },
    ],
    about: {
      pl: 'Odpowiednik kalendarza chmurowego, ale z regułami napisanymi pod konkretny model działania gabinetu — i to te reguły są treścią projektu. Serie cykliczne, karnety z rozliczaniem zużycia, rozliczenia z firmą jako płatnikiem oraz przypomnienia push wysyłane funkcją brzegową. Schemat rozwijany przyrostowo przez 39 wersjonowanych migracji, a typy TypeScript generowane wprost z bazy, więc kontrakt między bazą a frontendem sprawdza kompilator.',
      en: 'A cloud-calendar equivalent, except the rules are written for one clinic’s way of working — and those rules are the substance of the project. Recurring series, passes with usage settlement, company-as-payer billing and push reminders sent from an edge function. The schema grew across 39 versioned migrations, with TypeScript types generated straight from the database, so the contract between database and front-end is checked by the compiler.',
    },
  },
  {
    id: 'training-reports',
    name: { pl: 'Generator raportów treningowych', en: 'Training report generator' },
    category: 'web',
    year: '2026',
    image: shotTraining,
    color: '#0891b2',
    status: 'forSale',
    tagline: {
      pl: 'Surowy eksport z systemu pomiarowego wchodzi, gotowy raport A4 wychodzi.',
      en: 'A raw export from the tracking system goes in, a finished A4 report comes out.',
    },
    role: { pl: 'Projekt i wdrożenie', en: 'Design & build' },
    stack: ['React 19 + Vite', 'TypeScript', 'Supabase / PostgreSQL', 'Row Level Security', 'pdf.js', 'SheetJS', 'Vitest'],
    highlights: [
      {
        pl: 'Dwa niezależne formaty wejściowe: arkusz z systemu pomiarowego oraz tabela odczytywana z gotowego PDF-a po współrzędnych tekstu.',
        en: 'Two independent input formats: a sheet from the tracking system and a table read out of a finished PDF by text coordinates.',
      },
      {
        pl: 'Dopasowywanie nazwisk między źródłami kaskadą metod, z oceną pewności i stanem „niejednoznaczne”, który oddaje decyzję człowiekowi zamiast zgadywać.',
        en: 'Name matching across sources through a cascade of methods, with a confidence score and an “ambiguous” state that hands the decision to a person instead of guessing.',
      },
      {
        pl: '532 testy na czystych funkcjach — przy narzędziu analitycznym błąd nie objawia się awarią, tylko cichą, wiarygodnie wyglądającą liczbą.',
        en: '532 tests over pure functions — in an analytics tool a bug does not show up as a crash but as a quiet, plausible-looking number.',
      },
    ],
    about: {
      pl: 'Narzędzie dla trenerów przygotowania motorycznego, które zastępuje raport składany wcześniej ręcznie w arkuszu. Obsługuje raport dzienny, tygodniowy, zestawienie kilku raportów, porównanie okresów i kartę zawodnika. Dokument jest tu danymi, nie widokiem: kartki mają trwałe identyfikatory, więc można je usuwać, przywracać i przestawiać przeciąganiem, a zapis odtwarza dokładnie ten układ. Wykresy rysowane własnym kodem SVG, żeby dokument wyglądał identycznie na ekranie i w druku.',
      en: 'A tool for strength and conditioning coaches, replacing a report previously assembled by hand in a spreadsheet. It covers daily and weekly reports, multi-report roll-ups, period comparisons and single-athlete cards. The document is data here, not a view: pages carry durable identifiers, so they can be removed, restored and reordered by dragging, and saving restores exactly that layout. Charts are drawn in hand-written SVG so the document looks identical on screen and in print.',
    },
  },
  {
    id: 'party-game',
    name: { pl: 'Gra towarzyska online', en: 'Online party game' },
    category: 'web',
    year: '2026',
    image: shotGame,
    color: '#e11d48',
    status: 'forSale',
    tagline: {
      pl: 'Wieloosobowa gra przeglądarkowa typu „kto jest oszustem”, sześć trybów rozgrywki.',
      en: 'A browser party game of “spot the impostor”, with six game modes.',
    },
    role: { pl: 'Serwer gry i interfejs', en: 'Game server & interface' },
    stack: ['React + TypeScript', 'Node + Express', 'Socket.IO', 'Redis', 'JWT + bcrypt', 'i18n'],
    highlights: [
      {
        pl: 'Serwer jest jedynym źródłem prawdy, a każdy gracz dostaje własny widok stanu — sekret nie trafia do przeglądarki kogoś, kto nie ma prawa go znać.',
        en: 'The server is the only source of truth and every player gets their own view of state — the secret never reaches a browser with no right to it.',
      },
      {
        pl: 'Zegary tury po stronie serwera z marginesem tolerancji, żeby gracze ze słabszym łączem nie tracili tur systematycznie.',
        en: 'Server-side turn clocks with a tolerance margin, so players on slower connections do not lose turns systematically.',
      },
      {
        pl: 'Rozłączenie jest regułą gry, a nie awarią: gracz offline dostaje skróconą turę, więc jedna zerwana sesja nie zatrzymuje stołu.',
        en: 'A dropped connection is a rule of the game, not a failure: an offline player gets a shortened turn, so one lost session does not stall the table.',
      },
    ],
    about: {
      pl: 'Projekt dowodowy tego, że potrafię napisać autorytatywny serwer stanu w czasie rzeczywistym, a nie tylko CRUD. Gracze dołączają kodem pokoju, dostają hasło (poza oszustem), na zmianę dają wskazówki i głosują. Sześć trybów, m.in. wersja z rysowaniem zamiast słów, wariant ze zwiększoną liczbą oszustów i tryb współpracy. Warstwa trwałości jest wymienna — Redis albo plik JSON za jednym interfejsem — więc ta sama aplikacja uruchamia się lokalnie bez żadnej infrastruktury.',
      en: 'A proof project for writing an authoritative real-time state server rather than another CRUD app. Players join with a room code, receive a password (except the impostor), take turns giving clues and vote. Six modes, including a drawing variant, a version with more impostors and a co-op mode. The persistence layer is swappable — Redis or a JSON file behind one interface — so the same app runs locally with no infrastructure at all.',
    },
  },
  {
    id: 'service-reports',
    name: { pl: 'System raportów serwisowych', en: 'Field service reports' },
    category: 'web',
    year: '2026',
    image: '',
    color: '#0f9d6a',
    status: 'private',
    tagline: {
      pl: 'Zlecenia, technicy w terenie i raport serwisowy podpisywany palcem na miejscu.',
      en: 'Work orders, field technicians and a service report signed on screen at the site.',
    },
    role: { pl: 'Backend i aplikacja terenowa', en: 'Backend & field app' },
    stack: ['NestJS', 'Prisma + PostgreSQL', 'Redis', 'Puppeteer (PDF)', 'Next.js + React 19', 'Socket.IO', 'Playwright E2E', 'Swagger'],
    highlights: [
      {
        pl: 'Raport jest rekordem z historią, nie plikiem: obieg szkic → złożony → zatwierdzony / odrzucony, ze znacznikami czasu każdego przejścia.',
        en: 'The report is a record with history, not a file: draft → submitted → approved / rejected, with a timestamp on every transition.',
      },
      {
        pl: 'PDF generowany z szablonu HTML przez przeglądarkę bezgłową, w kolejce — pełna kontrola nad typografią i marginesami A4 bez blokowania żądań HTTP.',
        en: 'PDFs rendered from an HTML template by a headless browser on a queue — full control over typography and A4 margins without blocking HTTP requests.',
      },
      {
        pl: 'Aplikacja przygotowana na słaby zasięg: lokalna baza w przeglądarce, powiadomienia push i kanał czasu rzeczywistego.',
        en: 'Built for weak coverage: a local in-browser database, push notifications and a real-time channel.',
      },
    ],
    about: {
      pl: 'System dla firmy serwisującej urządzenia techniczne w terenie: zlecenia, przydział techników, statusy i priorytety, a na końcu podpisany raport z numerem i ścieżką akceptacji. Bezpieczeństwo jest tu wymaganiem, nie dodatkiem — aplikacja odmawia startu przy słabych sekretach, tokeny odświeżające są rotowane i trzymane w bazie, a dziennik audytu zapisuje wartość przed i po, obejmując także nieudane logowania. Każdy punkt z audytu ma własny test E2E.',
      en: 'A system for a company servicing technical equipment in the field: work orders, technician assignment, statuses and priorities, ending in a signed, numbered report with an approval path. Security is a requirement rather than an add-on — the app refuses to start on weak secrets, refresh tokens are rotated and stored in the database, and the audit log records before and after values, including failed logins. Every audit point has its own end-to-end test.',
    },
  },
  {
    id: 'course-platform',
    name: { pl: 'Platforma sprzedaży kursów', en: 'Course sales platform' },
    category: 'commerce',
    year: '2026',
    image: img('1627542557169-5ed71c66ed85'),
    color: '#d97706',
    status: 'ongoing',
    tagline: {
      pl: 'Katalog kursów, terminarz slotów i rezerwacje ze ścieżką potwierdzenia.',
      en: 'A course catalogue, a slot calendar and bookings with a confirmation path.',
    },
    role: { pl: 'Backend i frontend', en: 'Backend & front-end' },
    stack: ['NestJS 11', 'MongoDB / Mongoose', 'Angular 19', 'PWA + Service Worker', 'Web Push', 'JWT + Passport'],
    highlights: [
      {
        pl: 'Trasy publiczne i administracyjne rozdzielone dla każdego zasobu — uprawnienie jest własnością trasy, a nie warunkiem ukrytym w środku metody.',
        en: 'Public and admin routes split per resource — permission belongs to the route instead of hiding inside a method.',
      },
      {
        pl: 'Strefa czasowa obsłużona jawnie i w jednym miejscu, bo w systemie rezerwacyjnym „godzina” to pojęcie kalendarza, a nie punkt na osi czasu.',
        en: 'Time zones handled explicitly and in one place, because in a booking system an “hour” is a calendar concept, not a point on a timeline.',
      },
      {
        pl: 'Przypomnienia szukane w oknie czasowym, nie o konkretnej godzinie — opóźnienie albo restart procesu nie powoduje pominięcia wysyłki.',
        en: 'Reminders matched over a time window rather than at an exact hour — a delay or a process restart cannot skip a send.',
      },
    ],
    about: {
      pl: 'Platforma pozwalająca sprzedawać własne kursy i zajęcia: katalog, terminarz dostępnych slotów, rezerwacje, panel administracyjny, komunikacja z uczestnikiem i przypomnienia. Model zbliżony do znanych platform kursowych, ale prowadzony przez jednego autora treści. Frontend działa jako PWA z service workerem i własną warstwą tłumaczeń. Projekt jest w trakcie realizacji — podgląd udostępnimy po wdrożeniu.',
      en: 'A platform for selling your own courses and classes: catalogue, calendar of available slots, bookings, an admin panel, participant messaging and reminders. The model is close to the familiar course platforms, but run by a single content author. The front-end is a PWA with a service worker and its own translation layer. The project is still in progress — preview once it ships.',
    },
  },
  {
    id: 'restaurant-booking',
    name: { pl: 'Wizytówka restauracji z rezerwacjami', en: 'Restaurant site with bookings' },
    category: 'landing',
    year: '2025',
    image: img('1539278383962-a7774385fa02'),
    color: '#7c3aed',
    status: 'forSale',
    tagline: {
      pl: 'Strona lokalu i rezerwacje: stolik, wydarzenie albo wynajem całego lokalu.',
      en: 'A venue site with bookings: a table, an event or a whole-venue hire.',
    },
    role: { pl: 'Projekt, wdrożenie i audyt', en: 'Design, build & audit' },
    stack: ['Angular 17 + PWA', 'Node + Express', 'MongoDB / Mongoose', 'JWT + refresh', 'reCAPTCHA v3', 'Web Push', 'Playwright', 'Tailwind'],
    highlights: [
      {
        pl: 'Trzy rodzaje rezerwacji w jednym modelu — stolik, wydarzenie i wynajem całego lokalu — a sprawdzenie kolizji rozumie, że wynajem lokalu wyklucza wszystkie pozostałe stoliki.',
        en: 'Three kinds of booking in one model — table, event and whole-venue hire — with collision checks that know a venue hire rules out every remaining table.',
      },
      {
        pl: 'Godziny otwarcia jako jedno źródło prawdy: ten sam rekord zasila stopkę strony, panel i walidację dostępnych terminów, więc strona nie obiecuje czegoś, czego system nie przyjmie.',
        en: 'Opening hours as one source of truth: the same record feeds the site footer, the admin panel and slot validation, so the site cannot promise what the system will refuse.',
      },
      {
        pl: 'Pełny cykl bezpieczeństwa: własny audyt (23 ustalenia, w tym 5 krytycznych), naprawy i 35 testów E2E pilnujących, żeby nie wróciły.',
        en: 'A full security cycle: a self-run audit (23 findings, 5 critical), the fixes, and 35 end-to-end tests that keep them from coming back.',
      },
    ],
    about: {
      pl: 'Strona restauracji połączona z systemem rezerwacji, w którym obsługa prowadzi wszystko z panelu: stoliki i sale, menu z kategoriami, godziny otwarcia, potwierdzenia i raporty dzienne. Panel jest osobną aplikacją instalowalną na telefonie, z wymuszoną aktualizacją pokazywaną tylko obsłudze — zainstalowana PWA nie ma przycisku odświeżania, więc administrator, który odłoży aktualizację, potrafi utknąć na starej wersji bez drogi wyjścia.',
      en: 'A restaurant site wired to a booking system where staff run everything from one panel: tables and rooms, a categorised menu, opening hours, confirmations and daily reports. The panel is a separate app installable on a phone, with a forced update prompt shown only to staff — an installed PWA has no refresh button, so an admin who postpones an update can get stuck on an old version with no way out.',
    },
  },
  {
    id: 'mk-cycling',
    name: { pl: 'MK Cycling — strona trenera kolarstwa', en: 'MK Cycling — cycling coach site' },
    category: 'landing',
    year: '2026',
    image: shotMkCycling,
    color: '#84cc16',
    tagline: {
      pl: 'Strona dla trenera kolarstwa szosowego, która ma zamieniać odwiedzających w podopiecznych.',
      en: 'A site for a road cycling coach, built to turn visitors into athletes on his plan.',
    },
    role: { pl: 'Projekt i wdrożenie dla klienta', en: 'Design & build for a client' },
    stack: ['React + Vite', 'TypeScript', 'Framer Motion', 'Cloudflare Turnstile', 'Google Tag Manager', 'Schema.org'],
    highlights: [
      {
        pl: 'Realizacja dla prawdziwego klienta: trenera Marcina Karbowego z Poznania.',
        en: 'Built for a real client: coach Marcin Karbowy from Poznań.',
      },
      {
        pl: 'Formularz kontaktowy chroniony przez Cloudflare Turnstile zamiast uciążliwej CAPTCHY.',
        en: 'A contact form protected by Cloudflare Turnstile instead of an annoying CAPTCHA.',
      },
      {
        pl: 'Analityka w trybie zgody (Consent Mode): nic nie jest mierzone, dopóki odwiedzający nie zaakceptuje plików cookies.',
        en: 'Analytics in Consent Mode: nothing is measured until the visitor accepts cookies.',
      },
    ],
    about: {
      pl: 'Strona wizytówka trenera kolarstwa szosowego, który układa indywidualne plany treningowe. Ton i wygląd są podporządkowane jednemu celowi: przekonać kolarza amatora, że trening pod jego pracę i rodzinę da lepsze wyniki niż kopiowanie gotowych planów. Pod spodem zadbaliśmy o rzeczy, których klient nie widzi, a które decydują o wynikach w Google: szybkie ładowanie głównego zdjęcia, dane strukturalne dla lokalnego wyszukiwania i zgodność z RODO.',
      en: 'A showcase site for a road cycling coach who writes individual training plans. The tone and look serve one goal: convincing an amateur cyclist that training built around their job and family beats copying ready-made plans. Underneath, we took care of what the client never sees but what decides Google rankings: a fast-loading hero image, structured data for local search and GDPR compliance.',
    },
    liveUrl: 'https://mkcycling.pl/',
  },
  {
    id: 'pixel-bites',
    name: { pl: 'Pixel Bites — restauracja w stylu arcade', en: 'Pixel Bites — arcade-style restaurant' },
    category: 'landing',
    year: '2026',
    image: shotPixelBites,
    color: '#ec4899',
    tagline: {
      pl: 'Strona burgerowni zamieniona w grę retro: pixel art, neon i historia opowiadana przewijaniem.',
      en: 'A burger joint’s site turned into a retro game: pixel art, neon and a story told by scrolling.',
    },
    role: { pl: 'Projekt i wdrożenie', en: 'Design & build' },
    stack: ['React 18 + Vite', 'TypeScript', 'GSAP ScrollTrigger', 'Three.js', 'Lenis'],
    highlights: [
      {
        pl: 'Opowieść przewijana scena po scenie (GSAP ScrollTrigger) z płynnym przewijaniem (Lenis).',
        en: 'A story told scene by scene on scroll (GSAP ScrollTrigger) with smooth scrolling (Lenis).',
      },
      {
        pl: 'Tło 3D w WebGL (Three.js), własny kursor i przyciski przyciągane do kursora.',
        en: 'A 3D WebGL background (Three.js), a custom cursor and magnetic buttons.',
      },
      {
        pl: 'Interaktywne menu, wydarzenia, mapa dojazdu, karta lojalnościowa i FAQ, każda sekcja jako osobny komponent.',
        en: 'An interactive menu, events, a location map, a loyalty pass and FAQ, each section its own component.',
      },
    ],
    about: {
      pl: 'Strona dla lokalu, który chce być zapamiętany. Zamiast klasycznego szablonu z galerią potraw odwiedzający przechodzi przez grę: wchodzi do restauracji, zagląda do kuchni i składa burgera warstwa po warstwie. Projekt pokazuje, jak daleko może pójść strona gastronomiczna, kiedy marka ma wyraźny charakter.',
      en: 'A site for a venue that wants to be remembered. Instead of the usual template with a food gallery, the visitor plays through it: walks into the restaurant, peeks into the kitchen and stacks a burger layer by layer. It shows how far a restaurant site can go when the brand has a clear character.',
    },
    liveUrl: 'https://pixel-bites-tawny.vercel.app/',
    repoUrl: 'https://github.com/Sitkowski01/pixel_bites',
  },
  {
    id: 'bistro',
    name: { pl: 'Bistro — strona kawiarni śniadaniowej', en: 'Bistro — breakfast café site' },
    category: 'landing',
    year: '2026',
    image: shotBistro,
    color: '#3f7d58',
    tagline: {
      pl: 'Jasna, apetyczna wizytówka lokalu: menu, miejsce, warsztaty i dojazd na jednej stronie.',
      en: 'A bright, appetising venue site: menu, space, workshops and directions on one page.',
    },
    role: { pl: 'Projekt i wdrożenie', en: 'Design & build' },
    stack: ['React 18 + Vite', 'TypeScript', 'Tailwind CSS 4', 'Radix UI', 'Motion'],
    highlights: [
      {
        pl: 'Wierne odwzorowanie projektu z Figmy, z dopracowanymi animacjami.',
        en: 'A faithful build of the Figma design, with polished animations.',
      },
      {
        pl: 'Układ responsywny od telefonu po duży ekran.',
        en: 'A responsive layout from phone to large screen.',
      },
      {
        pl: 'Gotowy szablon do szybkiego wdrożenia dla kawiarni, bistro albo piekarni.',
        en: 'A ready template for a quick launch for a café, bistro or bakery.',
      },
    ],
    about: {
      pl: 'Strona dla małego lokalu gastronomicznego, który potrzebuje przede wszystkim dobrego pierwszego wrażenia i szybkiej odpowiedzi na pytania gościa: co podają, jak tam jest i jak dojechać. Tekst, zdjęcia i dane kontaktowe łatwo podmienić, więc stronę można wdrożyć dla nowego lokalu w kilka dni.',
      en: 'A site for a small food venue that above all needs a good first impression and quick answers to a guest’s questions: what they serve, what the place feels like and how to get there. Copy, photos and contact details are easy to swap, so the site can launch for a new venue within days.',
    },
    liveUrl: 'https://bistro-restaurant-umber.vercel.app/',
    repoUrl: 'https://github.com/Sitkowski01/bistroRestaurant',
  },
  {
    id: 'ice-cream',
    name: { pl: 'L’Artisan — lodziarnia z modelem 3D', en: 'L’Artisan — ice cream parlour in 3D' },
    category: 'landing',
    year: '2026',
    image: shotIceCream,
    color: '#c8a26b',
    tagline: {
      pl: 'Strona lodziarni, na której lód w rożku jest trójwymiarowym modelem poruszającym się razem z przewijaniem.',
      en: 'An ice cream parlour site where the cone is a 3D model that moves as you scroll.',
    },
    role: { pl: 'Projekt i wdrożenie', en: 'Design & build' },
    stack: ['Vite', 'JavaScript', 'Three.js', 'GSAP ScrollTrigger'],
    highlights: [
      {
        pl: 'Lód w rożku zbudowany w kodzie w Three.js, bez gotowego modelu z zewnątrz.',
        en: 'The ice cream cone is built in code with Three.js, with no ready-made external model.',
      },
      {
        pl: 'Animacja modelu sterowana przewijaniem (GSAP ScrollTrigger), która prowadzi przez kolejne sekcje.',
        en: 'Scroll-driven model animation (GSAP ScrollTrigger) that leads through the sections.',
      },
      {
        pl: 'Kolekcja smaków, sekcja o jakości i opinie klientów w eleganckiej, ciemnej stylistyce.',
        en: 'A flavour collection, a quality section and customer reviews in an elegant dark style.',
      },
    ],
    about: {
      pl: 'Wizytówka rzemieślniczej lodziarni, w której produkt jest bohaterem strony dosłownie: trójwymiarowy lód obraca się i przesuwa w miarę przewijania, a treść układa się wokół niego. Lekki stos bez frameworka, dzięki czemu cała moc idzie w animację, a nie w narzut biblioteki.',
      en: 'A showcase for an artisan ice cream parlour where the product is literally the star of the page: a 3D cone turns and moves as you scroll, with the content arranged around it. A light, framework-free stack, so the budget goes into the animation rather than library overhead.',
    },
    liveUrl: 'https://lody-page.vercel.app/',
  },
  {
    id: 'pizzeria',
    name: { pl: 'Inferno — pizzeria neapolitańska', en: 'Inferno — Neapolitan pizzeria' },
    category: 'landing',
    year: '2026',
    image: shotPizza,
    color: '#dc2626',
    tagline: {
      pl: 'Mocna, ciemna strona pizzerii z typografią, która krzyczy tak głośno jak piec opalany drewnem.',
      en: 'A bold, dark pizzeria site with typography as loud as a wood-fired oven.',
    },
    role: { pl: 'Projekt i wdrożenie', en: 'Design & build' },
    stack: ['Next.js', 'React', 'Tailwind CSS'],
    highlights: [
      {
        pl: 'Pełnoekranowe wejście z dużą typografią i zdjęciem w tle.',
        en: 'A full-screen entrance with large typography over a background photo.',
      },
      {
        pl: 'Przycisk rezerwacji stolika zawsze pod ręką w nawigacji.',
        en: 'A table booking button always at hand in the navigation.',
      },
      {
        pl: 'Gotowe podglądy do udostępniania w mediach społecznościowych (Open Graph).',
        en: 'Ready-made previews for sharing on social media (Open Graph).',
      },
    ],
    about: {
      pl: 'Strona dla pizzerii neapolitańskiej, która chce wyróżnić się charakterem, a nie kolejnym zdjęciem margherity na białym tle. Stylistyka ognia i ciemnych barw, krótkie teksty i jeden główny cel: rezerwacja stolika.',
      en: 'A site for a Neapolitan pizzeria that wants to stand out through character rather than yet another margherita on a white background. A fire-and-dark palette, short copy and one main goal: a table booking.',
    },
    liveUrl: 'https://inferno-pizza.vercel.app/',
  },
  {
    id: 'splitdebill',
    name: { pl: 'SplitDeBill — dzielenie rachunków', en: 'SplitDeBill — bill splitting' },
    category: 'mobile',
    year: '2026',
    image: shotSplitDeBill,
    color: '#84cc16',
    status: 'ongoing',
    tagline: {
      pl: 'Zdjęcie paragonu, rozpoznane pozycje i rachunek podzielony między znajomych bez liczenia w głowie.',
      en: 'Photograph the receipt, get the items recognised and split the bill between friends without mental maths.',
    },
    role: { pl: 'Backend, aplikacja mobilna i panel web', en: 'Backend, mobile app & web panel' },
    stack: ['NestJS', 'Prisma', 'Tesseract OCR', 'React Native + Expo', 'NativeWind', 'React + Vite', 'Docker'],
    highlights: [
      {
        pl: 'Rozpoznawanie pozycji z paragonu (OCR z modelami dla polskiego i angielskiego).',
        en: 'Line items read from the receipt (OCR with Polish and English models).',
      },
      {
        pl: 'Wspólne wyjazdy z wieloma walutami i podziałem po równo, ręcznie albo procentowo.',
        en: 'Shared trips with multiple currencies, split equally, manually or by percentage.',
      },
      {
        pl: 'Trzy warstwy jednego produktu: API, aplikacja mobilna i panel webowy.',
        en: 'Three layers of one product: an API, a mobile app and a web panel.',
      },
    ],
    about: {
      pl: 'Aplikacja dla znajomych, którzy razem wyjeżdżają albo wychodzą na kolację i nie chcą potem liczyć, kto komu ile oddaje. Wystarczy zrobić zdjęcie paragonu, przypisać pozycje osobom, a aplikacja pilnuje salda i podpowiada, kto powinien zapłacić następny. Projekt jest w trakcie realizacji — podgląd udostępnimy po wdrożeniu.',
      en: 'An app for friends who travel or eat out together and do not want to work out afterwards who owes whom. Photograph the receipt, assign items to people, and the app keeps the balance and suggests who should pay next. The project is still in progress — preview once it ships.',
    },
  },
  {
    id: 'explore-poland',
    name: { pl: 'Eksploruj Polskę — planer wypraw', en: 'Explore Poland — trip planner' },
    category: 'web',
    year: '2026',
    image: shotExplorePoland,
    color: '#c2410c',
    status: 'ongoing',
    tagline: {
      pl: 'Mapa atrakcji, planer tras i punkty za odwiedzone miejsca potwierdzone przez GPS.',
      en: 'A map of attractions, a route planner and points for visits confirmed by GPS.',
    },
    role: { pl: 'Projekt, backend i frontend', en: 'Design, backend & front-end' },
    stack: ['Next.js 15 + PWA', 'FastAPI', 'PostgreSQL + PostGIS', 'Google Maps Platform', 'OpenAI API', 'Docker'],
    highlights: [
      {
        pl: 'Atrakcje na mapie z zapytaniami geograficznymi w PostGIS.',
        en: 'Attractions on a map, backed by geographic queries in PostGIS.',
      },
      {
        pl: 'Planer tras na Google Directions i weryfikacja wizyty przez GPS.',
        en: 'A route planner on Google Directions and visit verification by GPS.',
      },
      {
        pl: 'Grywalizacja: punkty, reputacja użytkowników i opisy atrakcji generowane przez AI.',
        en: 'Gamification: points, user reputation and AI-generated attraction descriptions.',
      },
    ],
    about: {
      pl: 'Aplikacja do odkrywania atrakcji turystycznych w Polsce, która zamienia zwiedzanie w grę: zaplanuj trasę, odwiedź miejsce, potwierdź obecność telefonem i zbieraj punkty. Projekt jest w trakcie realizacji — podgląd udostępnimy po wdrożeniu.',
      en: 'An app for discovering tourist attractions in Poland that turns sightseeing into a game: plan a route, visit a place, confirm you were there with your phone and collect points. The project is still in progress — preview once it ships.',
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
  workNote: {
    pl: 'Każda z tych realizacji pokazuje inny zestaw umiejętności: inny backend, inny model danych, inne wymagania. Większość działa wewnątrz firm klientów, więc warstwa funkcjonalna — dane, ekrany i reguły biznesowe — pozostaje ich własnością i podglądu nie udostępniamy publicznie. Architekturę, kod i decyzje techniczne przechodzimy na żywo.',
    en: 'Each of these projects shows a different set of skills: a different backend, a different data model, different demands. Most run inside client companies, so the functional layer — data, screens and business rules — stays theirs and previews are not public. The architecture, the code and the decisions behind them we walk through live.',
  },
  workNoteCta: { pl: 'Umówmy spotkanie', en: 'Set up a meeting' },
  statusPrivate: { pl: 'Prywatny SaaS', en: 'Private SaaS' },
  statusOngoing: { pl: 'W realizacji', en: 'In progress' },
  statusForSale: { pl: 'Możliwa sprzedaż', en: 'For sale' },
  /** Studio motto, repeated on every face of the flipping business card. */
  motto: {
    pl: 'Zamieniamy szalone pomysły w działające aplikacje.',
    en: 'We turn your craziest ideas into real applications.',
  },
  forSaleNote: {
    pl: 'Gotowy produkt — możemy wdrożyć go u Ciebie i dopasować do Twoich reguł.',
    en: 'A finished product — we can deploy it for you and fit it to your rules.',
  },
  previewBlocked: { pl: 'Podgląd zablokowany', en: 'Preview blocked' },
  privateNote: {
    pl: 'Prywatny SaaS — podgląd i repozytorium pozostają niedostępne.',
    en: 'A private SaaS — preview and repository stay closed.',
  },
  ongoingNote: {
    pl: 'Projekt w realizacji — podgląd udostępnimy po wdrożeniu.',
    en: 'Still in progress — preview once it ships.',
  },
  commercialNote: {
    pl: 'Projekt komercyjny — kod niepubliczny.',
    en: 'A client project — source is not public.',
  },
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
  email: { pl: 'Napisz do nas', en: 'Send a message' },
  formTitle: { pl: 'Napisz do nas', en: 'Send us a message' },
  formBody: {
    pl: 'Odpowiadamy zwykle w ciągu jednego dnia roboczego.',
    en: 'We usually reply within one business day.',
  },
  formName: { pl: 'Imię', en: 'Name' },
  formEmail: { pl: 'E-mail', en: 'Email' },
  formMessage: { pl: 'Wiadomość', en: 'Message' },
  formNameHint: { pl: 'Jan Kowalski', en: 'Alex Smith' },
  formEmailHint: { pl: 'jan@firma.pl', en: 'alex@company.com' },
  formMessageHint: { pl: 'Nad czym pracujesz?', en: 'What are you working on?' },
  formSend: { pl: 'Wyślij wiadomość', en: 'Send message' },
  formSending: { pl: 'Wysyłanie…', en: 'Sending…' },
  formSentTitle: { pl: 'Wiadomość wysłana', en: 'Message sent' },
  formSentBody: {
    pl: 'Dzięki — odpowiemy na podany adres.',
    en: 'Thanks — we’ll reply to the address you gave us.',
  },
  formFailed: {
    pl: 'Nie udało się wysłać wiadomości. Spróbuj ponownie albo napisz bezpośrednio na adres poniżej.',
    en: 'The message could not be sent. Try again, or write to the address below.',
  },
  formMailFallback: {
    pl: 'Otworzyliśmy Twój program pocztowy z gotową treścią — wyślij wiadomość stamtąd.',
    en: 'We opened your mail app with the message ready — send it from there.',
  },
  formRetry: { pl: 'Spróbuj ponownie', en: 'Try again' },
  formOr: { pl: 'albo napisz wprost:', en: 'or write directly:' },
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
    image: mikolajPhoto,
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
