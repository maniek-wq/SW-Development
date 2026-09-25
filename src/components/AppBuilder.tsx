import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useSpring } from 'framer-motion'
import { projects, type Lang, type LS, type Project } from '../content'
import { scrollToSection, useDragScroll } from '../ui'

// "Put your app together": the visitor ticks features (or starts from a
// preset) and a device mock-up assembles their app live — screens, tabs and
// notifications included. Beside it: how big the job is, which of our projects
// it most resembles, and for every feature what we would build it with and
// where we already shipped it. Every "shipped in" points at a project whose
// own description covers that feature. "Take it to the brief" hands the
// selection to the brief ticket in Contact through a 'sw-brief' event.

type Platform = 'mobile' | 'web'
type FeatureId = 'login' | 'booking' | 'pay' | 'push' | 'admin' | 'ai' | 'map' | 'live' | 'pdf' | 'lang'
type Feature = { id: FeatureId; label: LS; desc: LS; tech: string[]; proof: string[]; weight: number }

// ── Edit features here; proof = ids of projects that genuinely have it ────
const FEATURES: Feature[] = [
  {
    id: 'login',
    label: { pl: 'Konta i logowanie', en: 'Accounts & login' },
    desc: { pl: 'Klienci mają swoje konto i historię.', en: 'Customers get an account and a history.' },
    tech: ['Supabase Auth', 'Firebase Auth', 'JWT'],
    proof: ['clinic-calendar', 'chart-scanner', 'dls'],
    weight: 1,
  },
  {
    id: 'booking',
    label: { pl: 'Rezerwacje', en: 'Bookings' },
    desc: { pl: 'Kalendarz bez podwójnych terminów.', en: 'A calendar that never double-books.' },
    tech: ['PostgreSQL', 'Supabase'],
    proof: ['clinic-calendar', 'restaurant-system', 'restaurant-booking', 'course-platform'],
    weight: 2,
  },
  {
    id: 'pay',
    label: { pl: 'Płatności', en: 'Payments' },
    desc: { pl: 'Abonamenty, karnety i rozliczenia.', en: 'Subscriptions, passes and billing.' },
    tech: ['RevenueCat', 'Google Play', 'SQL'],
    proof: ['chart-scanner', 'clinic-calendar'],
    weight: 2,
  },
  {
    id: 'push',
    label: { pl: 'Powiadomienia', en: 'Notifications' },
    desc: { pl: 'Przypomnienia, mniej nieobecności.', en: 'Reminders, fewer no-shows.' },
    tech: ['Web Push', 'Edge Functions'],
    proof: ['clinic-calendar', 'course-platform', 'restaurant-booking', 'service-reports'],
    weight: 1,
  },
  {
    id: 'admin',
    label: { pl: 'Panel admina', en: 'Admin panel' },
    desc: { pl: 'Zarządzasz wszystkim z jednego miejsca.', en: 'You run everything from one place.' },
    tech: ['React', 'Angular', 'RBAC'],
    proof: ['restaurant-booking', 'course-platform', 'restaurant-system'],
    weight: 2,
  },
  {
    id: 'ai',
    label: { pl: 'Funkcje AI', en: 'AI features' },
    desc: { pl: 'Analiza zdjęć, tekstu i danych.', en: 'Reading photos, text and data.' },
    tech: ['Gemini', 'OpenAI', 'OCR'],
    proof: ['chart-scanner', 'splitdebill', 'explore-poland'],
    weight: 2,
  },
  {
    id: 'map',
    label: { pl: 'Mapa i GPS', en: 'Maps & GPS' },
    desc: { pl: 'Lokalizacje, trasy i miejsca w okolicy.', en: 'Locations, routes and places nearby.' },
    tech: ['Google Maps', 'PostGIS'],
    proof: ['explore-poland'],
    weight: 2,
  },
  {
    id: 'live',
    label: { pl: 'Na żywo', en: 'Real-time' },
    desc: { pl: 'Czat i statusy bez odświeżania.', en: 'Chat and statuses without refreshing.' },
    tech: ['Socket.IO', 'Redis'],
    proof: ['dls', 'service-reports', 'party-game'],
    weight: 2,
  },
  {
    id: 'pdf',
    label: { pl: 'Raporty PDF', en: 'PDF reports' },
    desc: { pl: 'Dokumenty generowane jednym kliknięciem.', en: 'Documents generated in one click.' },
    tech: ['Puppeteer', 'pdf.js', 'SheetJS'],
    proof: ['training-reports', 'service-reports'],
    weight: 1,
  },
  {
    id: 'lang',
    label: { pl: 'Kilka języków', en: 'Multiple languages' },
    desc: { pl: 'Dla klientów spoza Polski.', en: 'For customers outside Poland.' },
    tech: ['i18n'],
    proof: ['party-game', 'course-platform'],
    weight: 1,
  },
]

const PRESETS: { label: LS; platform: Platform; features: FeatureId[] }[] = [
  { label: { pl: 'Salon / gabinet', en: 'Salon / clinic' }, platform: 'mobile', features: ['login', 'booking', 'pay', 'push', 'admin'] },
  { label: { pl: 'Restauracja', en: 'Restaurant' }, platform: 'web', features: ['booking', 'admin', 'push', 'lang'] },
  { label: { pl: 'Sklep internetowy', en: 'Online shop' }, platform: 'web', features: ['login', 'pay', 'push', 'admin', 'lang'] },
  { label: { pl: 'Siłownia / trener', en: 'Gym / coach' }, platform: 'mobile', features: ['login', 'booking', 'pay', 'push', 'live'] },
  { label: { pl: 'Kursy online', en: 'Online courses' }, platform: 'web', features: ['login', 'booking', 'pay', 'push', 'lang'] },
  { label: { pl: 'Aplikacja dla zespołu', en: 'Team app' }, platform: 'web', features: ['login', 'live', 'pdf', 'admin', 'map'] },
  { label: { pl: 'Ekipa w terenie', en: 'Field crew' }, platform: 'mobile', features: ['login', 'map', 'live', 'pdf'] },
  { label: { pl: 'Produkt z AI', en: 'AI product' }, platform: 'mobile', features: ['login', 'ai', 'pay', 'push'] },
  { label: { pl: 'Turystyka / miasto', en: 'Travel / city guide' }, platform: 'mobile', features: ['map', 'ai', 'lang', 'push'] },
  { label: { pl: 'Raporty dla firmy', en: 'Business reporting' }, platform: 'web', features: ['login', 'admin', 'pdf', 'ai'] },
]
// Words in a free-text idea (the hero prompt) that switch a feature on. Matched
// as lowercase word beginnings, so 'rezerwac' catches rezerwacja/rezerwacje.
const KEYWORDS: Record<FeatureId, string[]> = {
  login: ['konto', 'konta', 'logow', 'użytkownik', 'profil', 'account', 'login', 'log in', 'sign in', 'user', 'member'],
  booking: ['rezerwac', 'termin', 'wizyt', 'kalendarz', 'grafik', 'zapis', 'umawia', 'book', 'appointment', 'schedul', 'calendar'],
  pay: ['płat', 'płac', 'abonament', 'subskryp', 'karnet', 'sklep', 'sprzeda', 'zakup', 'faktur', 'pay', 'subscription', 'shop', 'store', 'checkout', 'billing', 'sell', 'e-commerce', 'ecommerce'],
  push: ['powiadom', 'przypom', 'sms', 'notyfik', 'notif', 'remind', 'push'],
  admin: ['panel', 'admin', 'statyst', 'zarządz', 'dashboard', 'cms', 'analityk', 'manage', 'stats'],
  ai: ['ai', 'sztuczn', 'gpt', 'chatbot', 'rozpozn', 'analiz', 'ocr', 'zdjęci', 'skan', 'photo', 'scan', 'recogni'],
  map: ['map', 'gps', 'lokaliz', 'tras', 'dojazd', 'okolic', 'zwiedza', 'wycieczk', 'teren', 'location', 'route', 'nearby', 'trip', 'tour'],
  live: ['czat', 'chat', 'na żywo', 'czasie rzeczywist', 'wiadomoś', 'komunikat', 'zespoł', 'ekip', 'message', 'live', 'real-time', 'realtime', 'team', 'crew'],
  pdf: ['pdf', 'raport', 'dokument', 'eksport', 'protokół', 'protokoł', 'report', 'invoice', 'export'],
  lang: ['język', 'angiel', 'międzynarod', 'zagranic', 'turyst', 'languag', 'english', 'international', 'tourist', 'i18n'],
}
const MOBILE_WORDS = ['telefon', 'mobil', 'android', 'ios', 'iphone', 'smartfon', 'phone', 'app store', 'google play']
const WEB_WORDS = ['stron', 'www', 'przeglądar', 'web', 'internetow', 'site', 'browser', 'online']
// ──────────────────────────────────────────────────────────────────────────

const byId = (id: string) => projects.find((p) => p.id === id)

// One pattern per keyword, built once: readIdea runs on every keystroke and on
// every step of the hero's self-typing example.
const patterns = new Map<string, RegExp>()
const pattern = (word: string) => {
  let rx = patterns.get(word)
  if (!rx) {
    rx = new RegExp(`[^\\p{L}]${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'u')
    patterns.set(word, rx)
  }
  return rx
}

/** Reads a free-text idea into a platform (if it says) and the features it mentions. */
export function readIdea(text: string): { platform: Platform | null; features: FeatureId[] } {
  const s = ` ${text.toLowerCase()}`
  const mentions = (word: string) => pattern(word).test(s)
  const features = FEATURES.filter((f) => KEYWORDS[f.id].some(mentions)).map((f) => f.id)
  const platform = MOBILE_WORDS.some(mentions) ? 'mobile' : WEB_WORDS.some(mentions) ? 'web' : null
  return { platform, features }
}

/** The project of ours that covers the most of the given features. */
export function closestProject(ids: FeatureId[]) {
  const chosen = FEATURES.filter((f) => ids.includes(f.id))
  const best = projects
    .map((p) => ({ p, n: chosen.filter((f) => f.proof.includes(p.id)).length }))
    .sort((a, b) => b.n - a.n)[0]
  return best && best.n > 0 ? best : null
}

export const featureLabel = (id: FeatureId) => FEATURES.find((f) => f.id === id)!.label
export type { FeatureId, Platform }

const copy = {
  presets: { pl: 'Szybki start', en: 'Quick start' },
  platform: { pl: 'Gdzie ma działać?', en: 'Where should it run?' },
  mobile: { pl: 'Telefon', en: 'Phone' },
  web: { pl: 'Przeglądarka', en: 'Browser' },
  pick: { pl: 'Czego potrzebuje?', en: 'What does it need?' },
  clear: { pl: 'Wyczyść', en: 'Clear' },
  empty: { pl: 'Zaznacz funkcje, a aplikacja złoży się tutaj', en: 'Tick features and the app assembles here' },
  scope: { pl: 'Zakres', en: 'Scope' },
  scopes: {
    pl: ['Kameralny', 'Średni', 'Rozbudowany'],
    en: ['Compact', 'Medium', 'Extensive'],
  },
  closest: { pl: 'Najbliżej tego, co już zrobiliśmy', en: 'Closest to what we have built' },
  how: { pl: 'Jak to zbudujemy', en: 'How we would build it' },
  done: { pl: 'Zrobione w', en: 'Shipped in' },
  toBrief: { pl: 'Przenieś do briefu', en: 'Take it to the brief' },
  features: { pl: 'funkcji', en: 'features' },
}

/* ----------------------------------------------------------------- Icons */

const icons: Record<FeatureId | 'home' | 'user', ReactNode> = {
  login: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c0-3.3 3.1-6 7-6s7 2.7 7 6" />,
  booking: <path d="M4 7h16v13H4zM4 11h16M9 3v4M15 3v4" />,
  pay: <path d="M3 7h18v10H3zM3 11h18M7 15h3" />,
  push: <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Zm4 4h4" />,
  admin: <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />,
  ai: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
  map: <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10Zm0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  live: <path d="M4 5h16v10H9l-5 4V5Z" />,
  pdf: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h4" />,
  lang: <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />,
  home: <path d="M4 11 12 4l8 7v9H4z" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c0-3.3 3.1-6 7-6s7 2.7 7 6" />,
}

function Icon({ name, className = 'h-4 w-4' }: { name: keyof typeof icons; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}

/* ------------------------------------------------------- Screen modules */

const tiny = 'font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]'
const card =
  'min-w-0 overflow-hidden rounded-2xl bg-[var(--color-surface)] p-3 shadow-[0_1px_0_var(--color-line),0_6px_16px_-10px_rgba(20,20,20,0.25)]'

/** One module of the imagined app, as it appears on screen. */
function Module({ id, lang }: { id: FeatureId; lang: Lang }) {
  const pl = lang === 'pl'
  switch (id) {
    case 'ai':
      return (
        <div className="min-w-0 overflow-hidden rounded-2xl bg-[#141414] p-3 text-[#f5f2ec]">
          <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
            <Icon name="ai" className="h-3 w-3" /> {pl ? 'Podpowiedź AI' : 'AI insight'}
          </p>
          <p className="mt-1.5 font-display text-[13px] leading-snug">
            {pl ? 'W piątki masz o 30% więcej klientów — dodać termin?' : 'Fridays bring 30% more customers — add a slot?'}
          </p>
        </div>
      )
    case 'booking':
      return (
        <div className={card}>
          <div className="flex items-baseline justify-between">
            <p className={tiny}>{pl ? 'Wybierz termin' : 'Pick a time'}</p>
            <p className="text-[9px] text-[var(--color-ink-soft)]">{pl ? 'wrzesień' : 'September'}</p>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {(pl ? ['Pn', 'Wt', 'Śr', 'Cz', 'Pt'] : ['Mo', 'Tu', 'We', 'Th', 'Fr']).map((d, i) => (
              <span
                key={d}
                className={`flex flex-col items-center rounded-lg py-1 text-[8px] ${
                  i === 2
                    ? 'bg-[var(--color-ink)] text-[var(--color-canvas)]'
                    : 'bg-[var(--color-canvas)] text-[var(--color-ink-soft)]'
                }`}
              >
                {d}
                <b className="text-[11px] font-semibold">{22 + i}</b>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            {['16:00', '17:30', '19:00'].map((h, i) => (
              <span
                key={h}
                className={`flex-1 rounded-full border py-1 text-center text-[9px] ${
                  i === 1
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] font-semibold text-[var(--color-accent-ink)]'
                    : 'border-[var(--color-line)] text-[var(--color-ink-soft)]'
                }`}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )
    case 'pay':
      return (
        <div className={`${card} flex items-center gap-2.5`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]">
            <Icon name="pay" />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`${tiny} truncate`}>{pl ? 'Karnet PRO' : 'PRO plan'}</p>
            <p className="font-display text-base leading-tight text-[var(--color-ink)]">149 zł</p>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-[10px] font-semibold text-[var(--color-on-accent)]">
            {pl ? 'Kup' : 'Buy'}
          </span>
        </div>
      )
    case 'live':
      return (
        <div className={`${card} space-y-1.5`}>
          <p className="flex items-center gap-1.5 text-[9px] font-medium text-[var(--color-positive)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-positive)]" />{' '}
            {pl ? 'Marta pisze…' : 'Marta is typing…'}
          </p>
          <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-[var(--color-canvas)] px-2.5 py-1.5 text-[10px] text-[var(--color-ink)]">
            {pl ? 'Będę 5 min wcześniej 🙂' : 'I’ll be 5 min early 🙂'}
          </p>
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-[var(--color-ink)] px-2.5 py-1.5 text-[10px] text-[var(--color-canvas)]">
            {pl ? 'Super, czekamy!' : 'Great, see you!'}
          </p>
        </div>
      )
    case 'map':
      return (
        <div
          className="relative h-20 min-w-0 overflow-hidden rounded-2xl bg-[var(--color-accent-soft)]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path
              d="M-5 32 C 20 12, 40 38, 64 14 S 110 22, 110 22"
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity="0.5"
              strokeWidth="1.4"
              strokeDasharray="3 3"
            />
          </svg>
          <span className="absolute left-[60%] top-[14%] flex h-5 w-5 items-center justify-center rounded-full rounded-bl-none bg-[var(--color-accent)] shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-[#141414]" />
          </span>
          <span className="absolute bottom-2 left-2 rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[8px] text-[var(--color-ink)] shadow">
            {pl ? '1,2 km · 4 min' : '1.2 km · 4 min'}
          </span>
        </div>
      )
    case 'admin':
      return (
        <div className={card}>
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className={`${tiny} truncate`}>{pl ? 'Ten tydzień' : 'This week'}</p>
              <p className="font-display text-xl leading-none text-[var(--color-ink)]">
                48 <span className="font-sans text-[9px] text-[var(--color-positive)]">+12%</span>
              </p>
            </div>
            <div className="flex h-9 shrink-0 items-end gap-[3px]">
              {[35, 55, 42, 70, 52, 92, 64].map((h, i) => (
                <span
                  key={i}
                  className={`w-[5px] rounded-full ${i === 5 ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-line-strong)]'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      )
    case 'pdf':
      return (
        <div className={`${card} flex items-center gap-3`}>
          <span className="flex h-9 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--color-line-strong)] font-mono text-[7px] font-bold text-[var(--color-accent-ink)]">
            PDF
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium text-[var(--color-ink)]">
              {pl ? 'Raport_09.pdf' : 'Report_09.pdf'}
            </p>
            <p className={tiny}>184 KB</p>
          </div>
          <span className="shrink-0 text-[var(--color-ink-soft)]">↓</span>
        </div>
      )
    default:
      return null
  }
}

/** Order the modules sit in on screen, top to bottom. */
const SCREEN_ORDER: FeatureId[] = ['ai', 'booking', 'pay', 'live', 'map', 'admin', 'pdf']
/** On the browser dashboard: wide modules take a full row, small ones pair up. */
const WEB_ORDER: FeatureId[] = ['ai', 'booking', 'pay', 'admin', 'map', 'pdf', 'live']
const WEB_WIDE: FeatureId[] = ['ai', 'booking', 'live']

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3.5 text-[10px] font-semibold text-[var(--color-ink)]">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="flex items-end gap-[1.5px]">
          {[4, 6, 8, 10].map((h) => (
            <span key={h} className="w-[2.5px] rounded-sm bg-[var(--color-ink)]" style={{ height: h }} />
          ))}
        </span>
        <span className="ml-1 flex h-[9px] w-[18px] items-center rounded-[3px] border border-[var(--color-ink)] p-[1.5px]">
          <span className="h-full w-3/4 rounded-[1px] bg-[var(--color-ink)]" />
        </span>
      </span>
    </div>
  )
}

function Device({ platform, picked, lang }: { platform: Platform; picked: FeatureId[]; lang: Lang }) {
  const pl = lang === 'pl'
  const has = (id: FeatureId) => picked.includes(id)
  const modules = (platform === 'web' ? WEB_ORDER : SCREEN_ORDER).filter(has)
  // A small module left without a partner takes the whole row instead.
  const small = modules.filter((id) => !WEB_WIDE.includes(id))
  const wide = (id: FeatureId) =>
    WEB_WIDE.includes(id) || (small.length % 2 === 1 && small[small.length - 1] === id)

  // A real notification comes and goes: show it for a few seconds, then again.
  const [ping, setPing] = useState(false)
  const pushOn = has('push')
  useEffect(() => {
    if (!pushOn) return setPing(false)
    let hide: number | undefined
    const show = () => {
      setPing(true)
      hide = window.setTimeout(() => setPing(false), 3400)
    }
    const first = window.setTimeout(show, 350)
    const cycle = window.setInterval(show, 7000)
    return () => {
      window.clearTimeout(first)
      window.clearTimeout(hide)
      window.clearInterval(cycle)
    }
  }, [pushOn])

  const header = (
    <div className="flex items-center justify-between">
      <div>
        <p className={tiny}>{pl ? 'Twoja marka' : 'Your brand'}</p>
        <p className="mt-0.5 font-display text-lg leading-tight text-[var(--color-ink)]">
          {has('login') ? (pl ? 'Dzień dobry, Anna' : 'Good morning, Anna') : pl ? 'Witaj' : 'Welcome'}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <AnimatePresence>
          {has('lang') && (
            <motion.span
              key="lang"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="rounded-full border border-[var(--color-line-strong)] px-1.5 py-0.5 font-mono text-[8px] text-[var(--color-ink-soft)]"
            >
              PL · EN
            </motion.span>
          )}
          {has('login') && (
            <motion.span
              key="avatar"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-[var(--color-on-accent)]"
            >
              A
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  const stack = (
    <LayoutGroup>
      <motion.div layout className={platform === 'web' ? 'grid grid-cols-1 gap-2.5 sm:grid-cols-2' : 'flex flex-col gap-2.5'}>
        <AnimatePresence initial={false} mode="popLayout">
          {modules.map((id) => (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className={`min-w-0 ${platform === 'web' && wide(id) ? 'sm:col-span-2' : ''}`}
            >
              <Module id={id} lang={lang} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {picked.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-[var(--color-line-strong)] px-4 py-10 text-center text-[11px] leading-relaxed text-[var(--color-ink-faint)]">
          {copy.empty[lang]}
        </div>
      )}
    </LayoutGroup>
  )

  const notification = (
    <AnimatePresence>
      {ping && (
        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className={`absolute z-20 flex items-center gap-2.5 rounded-2xl bg-[var(--color-surface)]/95 p-2.5 shadow-[0_12px_30px_-12px_rgba(20,20,20,0.45)] backdrop-blur ${
            platform === 'mobile' ? 'inset-x-2.5 top-10' : 'right-3 top-3 w-60'
          }`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#141414] font-display text-[10px] text-[#f5f2ec]">
            SW
          </span>
          <div className="min-w-0 leading-tight">
            <p className="text-[10px] font-semibold text-[var(--color-ink)]">{pl ? 'Przypomnienie' : 'Reminder'}</p>
            <p className="truncate text-[10px] text-[var(--color-ink-soft)]">
              {pl ? 'Jutro 17:30 · potwierdź wizytę' : 'Tomorrow 5:30pm · confirm your visit'}
            </p>
          </div>
          <span className="ml-auto self-start text-[8px] text-[var(--color-ink-faint)]">{pl ? 'teraz' : 'now'}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Navigation grows with the app: a tab or menu item for each area.
  const nav: { key: keyof typeof icons; label: LS }[] = [
    { key: 'home', label: { pl: 'Start', en: 'Home' } },
    ...(has('booking') ? [{ key: 'booking' as const, label: { pl: 'Terminy', en: 'Bookings' } }] : []),
    ...(has('map') ? [{ key: 'map' as const, label: { pl: 'Mapa', en: 'Map' } }] : []),
    ...(has('live') ? [{ key: 'live' as const, label: { pl: 'Czat', en: 'Chat' } }] : []),
    ...(has('admin') ? [{ key: 'admin' as const, label: { pl: 'Statystyki', en: 'Stats' } }] : []),
    ...(has('login') ? [{ key: 'user' as const, label: { pl: 'Profil', en: 'Profile' } }] : []),
  ]

  if (platform === 'mobile') {
    return (
      <div className="relative mx-auto h-[580px] w-[288px] rounded-[48px] bg-[#141414] p-[10px] shadow-[0_50px_80px_-40px_rgba(20,20,20,0.7),inset_0_0_0_1.5px_#3a3834] dark:ring-1 dark:ring-[#4a4640]">
        <div className="relative h-full overflow-hidden rounded-[38px] bg-[var(--color-canvas)]">
          <div className="absolute left-1/2 top-2.5 z-30 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-[#141414]" />
          <StatusBar />
          {notification}
          <div className="px-4 pt-5">{header}</div>
          <div className="mt-4 h-[392px] overflow-hidden px-4 [mask-image:linear-gradient(to_bottom,#000_88%,transparent)]">
            {stack}
          </div>
          <LayoutGroup>
            <motion.div
              layout
              className="absolute inset-x-3 bottom-3 flex items-center justify-around rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)]/95 px-2 py-2 backdrop-blur"
            >
              <AnimatePresence initial={false}>
                {nav.map((n, i) => (
                  <motion.span
                    key={n.key}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`flex flex-col items-center gap-0.5 text-[7px] ${
                      i === 0 ? 'text-[var(--color-accent-ink)]' : 'text-[var(--color-ink-faint)]'
                    }`}
                  >
                    <Icon name={n.key} className="h-4 w-4" />
                    {n.label[lang]}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto w-full max-w-[540px] overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-canvas)] shadow-[0_50px_80px_-40px_rgba(20,20,20,0.6)]">
      <div className="flex h-8 items-center gap-1.5 border-b border-[var(--color-line)] bg-[var(--color-surface)] px-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-[var(--color-line-strong)]" />
        ))}
        <span className="mx-auto rounded-md bg-[var(--color-canvas)] px-10 py-0.5 font-mono text-[9px] text-[var(--color-ink-faint)]">
          {pl ? 'twoja-aplikacja.pl' : 'your-app.com'}
        </span>
      </div>
      <div className="relative flex min-h-[400px]">
        <LayoutGroup>
          <motion.aside
            layout
            className="hidden w-[96px] shrink-0 border-r sm:block border-[var(--color-line)] bg-[var(--color-surface)] px-2 py-3"
          >
            <p className="px-1.5 font-display text-sm text-[var(--color-ink)]">
              {pl ? 'Marka' : 'Brand'}
              <span className="text-[var(--color-accent)]">.</span>
            </p>
            <div className="mt-3 flex flex-col gap-0.5">
              <AnimatePresence initial={false}>
                {nav.map((n, i) => (
                  <motion.span
                    key={n.key}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className={`flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-[9px] ${
                      i === 0
                        ? 'bg-[var(--color-canvas)] font-semibold text-[var(--color-ink)]'
                        : 'text-[var(--color-ink-soft)]'
                    }`}
                  >
                    <Icon name={n.key} className="h-3.5 w-3.5" />
                    {n.label[lang]}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </motion.aside>
        </LayoutGroup>
        <div className="relative min-w-0 flex-1 p-4">
          {notification}
          {header}
          <div className="mt-4">{stack}</div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- The builder */

export default function AppBuilder({ lang, onOpen }: { lang: Lang; onOpen: (p: Project) => void }) {
  const [platform, setPlatform] = useState<Platform>('mobile')
  const [picked, setPicked] = useState<FeatureId[]>(PRESETS[0].features)
  const [callout, setCallout] = useState<Feature | null>(null)
  // "How we would build it" shows one ticked feature at a time; the one just
  // added opens, and if the open one is unticked the first ticked takes over.
  const [tab, setTab] = useState<FeatureId>(PRESETS[0].features[0])
  // Both sideways rows can be grabbed and dragged with the mouse.
  const presetRow = useDragScroll<HTMLDivElement>()
  const tabRow = useDragScroll<HTMLDivElement>()
  const calloutTimer = useRef<number | undefined>(undefined)
  const reduce = useReducedMotion()

  const flash = (f: Feature) => {
    setCallout(f)
    window.clearTimeout(calloutTimer.current)
    calloutTimer.current = window.setTimeout(() => setCallout(null), 1800)
  }
  useEffect(() => () => window.clearTimeout(calloutTimer.current), [])

  // The hero prompt hands over an idea it has read through a 'sw-builder' event.
  useEffect(() => {
    const onIdea = (e: Event) => {
      const { platform: p, features } = (e as CustomEvent<{ platform: Platform | null; features: FeatureId[] }>).detail
      if (p) setPlatform(p)
      if (features.length) {
        setPicked(features)
        setTab(features[0])
      }
    }
    window.addEventListener('sw-builder', onIdea)
    return () => window.removeEventListener('sw-builder', onIdea)
  }, [])

  const toggle = (f: Feature) => {
    if (picked.includes(f.id)) {
      setPicked((p) => p.filter((x) => x !== f.id))
    } else {
      setPicked((p) => [...p, f.id])
      setTab(f.id)
      flash(f)
    }
  }

  const chosen = FEATURES.filter((f) => picked.includes(f.id))
  const shown = chosen.find((f) => f.id === tab) ?? chosen[0]
  const weight = chosen.reduce((s, f) => s + f.weight, 0)
  const scope = weight <= 4 ? 0 : weight <= 9 ? 1 : 2
  const closest = closestProject(picked)

  // The device leans slightly toward the pointer, like the cards above.
  const tiltX = useSpring(0, { stiffness: 120, damping: 18 })
  const tiltY = useSpring(0, { stiffness: 120, damping: 18 })
  const onStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    tiltX.set((0.5 - (e.clientY - r.top) / r.height) * 8)
  }
  const onStageLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  const toBrief = () => {
    window.dispatchEvent(
      new CustomEvent('sw-brief', {
        detail: { type: platform === 'mobile' ? 'mobile' : 'web', features: chosen.map((f) => f.label[lang]) },
      })
    )
    scrollToSection('contact')
  }

  const label = 'font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]'

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:gap-x-12 lg:gap-y-5">
      {/* Controls */}
      <div className="min-w-0 lg:col-start-1">
        <p className={label}>{copy.presets[lang]}</p>
        <div ref={presetRow} className="-mx-4 mt-2.5 flex cursor-grab gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-32px),transparent)] [scrollbar-width:none] lg:mx-0 lg:px-0">
          {PRESETS.map((preset) => {
            const on =
              preset.platform === platform &&
              preset.features.length === picked.length &&
              preset.features.every((f) => picked.includes(f))
            return (
              <button
                key={preset.label.en}
                type="button"
                onClick={() => {
                  setPlatform(preset.platform)
                  setPicked(preset.features)
                }}
                aria-pressed={on}
                className={`min-h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm transition-colors ${
                  on
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-ink)]'
                    : 'border-[var(--color-line-strong)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]'
                }`}
              >
                {preset.label[lang]}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <p className={label}>{copy.pick[lang]}</p>
          <button
            type="button"
            onClick={() => setPicked([])}
            disabled={picked.length === 0}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-ink)] disabled:opacity-40"
          >
            {copy.clear[lang]} ×
          </button>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {FEATURES.map((f) => {
            const on = picked.includes(f.id)
            return (
              <button
                key={f.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(f)}
                className={`group relative flex items-center gap-2.5 rounded-xl border px-2.5 py-1.5 text-left transition-all duration-200 active:scale-[0.98] ${
                  on
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-canvas)] shadow-[0_14px_24px_-16px_rgba(20,20,20,0.6)]'
                    : 'border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-[var(--color-ink)]'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    on
                      ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)]'
                      : 'bg-[var(--color-canvas)] text-[var(--color-ink-soft)] group-hover:text-[var(--color-ink)]'
                  }`}
                >
                  <Icon name={f.id} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold leading-tight">{f.label[lang]}</span>
                  <span
                    className={`mt-0.5 hidden truncate text-[11.5px] leading-snug sm:block ${
                      on ? 'text-[var(--color-canvas)]/65' : 'text-[var(--color-ink-faint)]'
                    }`}
                  >
                    {f.desc[lang]}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* The device, on a drafting-table backdrop */}
      <div className="min-w-0 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
        <div
          className={`relative overflow-hidden rounded-3xl border border-[var(--color-line)] pb-6 pt-4 ${platform === 'web' ? 'px-3 sm:px-5' : 'px-4 sm:px-8'}`}
          style={{
            backgroundImage: 'radial-gradient(var(--color-line-strong) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            perspective: 1400,
          }}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
            style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 28%, transparent), transparent 70%)' }}
            aria-hidden="true"
          />

          <div
            className="relative z-10 mx-auto mb-4 flex w-fit rounded-full border border-[var(--color-line-strong)] bg-[var(--color-surface)] p-1"
            role="group"
            aria-label={copy.platform[lang]}
          >
            {(['mobile', 'web'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                aria-pressed={platform === p}
                className={`relative min-h-9 rounded-full px-5 text-sm transition-colors ${
                  platform === p ? 'text-[var(--color-canvas)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                }`}
              >
                {platform === p && (
                  <motion.span
                    layoutId="builder-platform"
                    className="absolute inset-0 rounded-full bg-[var(--color-ink)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{copy[p][lang]}</span>
              </button>
            ))}
          </div>
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }} className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Device platform={platform} picked={picked} lang={lang} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* A callout announcing each newly added feature and its tech */}
          <AnimatePresence>
            {callout && (
              <motion.div
                key={callout.id}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                className="absolute bottom-3 left-0 right-0 z-30 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-2.5 rounded-full bg-[#141414] py-2 pl-2 pr-4 text-[#f5f2ec] shadow-xl"
                aria-live="polite"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)]">
                  <Icon name={callout.id} className="h-3.5 w-3.5" />
                </span>
                <span className="whitespace-nowrap text-xs font-semibold">+ {callout.label[lang]}</span>
                <span className="truncate font-mono text-[10px] text-[#f5f2ec]/60">{callout.tech.join(' · ')}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* How we would build it (one feature at a time), then scope and the hand-off */}
      <div className="min-w-0 lg:col-start-1">
        <p className={label}>{copy.how[lang]}</p>
        <div className="mt-2.5 overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-surface)]">
          <div
            ref={tabRow}
            className="flex cursor-grab gap-1 overflow-x-auto border-b border-[var(--color-line)] p-1.5 [mask-image:linear-gradient(to_right,#000_calc(100%-40px),transparent)] [scrollbar-width:none]"
            role="tablist"
            aria-label={copy.how[lang]}
          >
            {chosen.map((f) => {
              const on = shown?.id === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(f.id)}
                  className={`relative flex min-h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-[12px] transition-colors ${
                    on ? 'font-semibold text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="builder-how-tab"
                      className="absolute inset-0 rounded-lg bg-[var(--color-canvas)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon name={f.id} className="relative h-3.5 w-3.5" />
                  <span className="relative">{f.label[lang]}</span>
                </button>
              )
            })}
            {chosen.length === 0 && <p className="px-2.5 py-1.5 text-[12px] text-[var(--color-ink-faint)]">—</p>}
          </div>
          <div className="relative min-h-[140px] p-3">
            <AnimatePresence mode="wait" initial={false}>
              {shown && (
                <motion.div
                  key={shown.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                >
                  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                      {copy.done[lang]} {shown.proof.length}×
                    </span>
                    <span className="font-mono text-[10px] text-[var(--color-accent-ink)]">{shown.tech.join(' · ')}</span>
                  </p>
                  <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {shown.proof.map((id) => {
                      const p = byId(id)
                      if (!p) return null
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => onOpen(p)}
                          title={`${copy.done[lang]}: ${p.name[lang]}`}
                          className="group/proof min-w-0 text-left"
                        >
                          <span className="block aspect-[16/10] overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-canvas)] transition-all duration-200 group-hover/proof:-translate-y-0.5 group-hover/proof:border-[var(--color-ink)] group-hover/proof:shadow-[0_10px_20px_-12px_rgba(20,20,20,0.5)]">
                            {p.status !== 'private' && p.image ? (
                              <img
                                src={p.image}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover/proof:scale-105"
                              />
                            ) : (
                              <span
                                className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]"
                                style={{
                                  backgroundImage:
                                    'repeating-linear-gradient(135deg, var(--color-line-strong) 0 1px, transparent 1px 6px)',
                                }}
                              >
                                <span className="rounded bg-[var(--color-canvas)] px-1.5 py-0.5">NDA</span>
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block truncate text-[11px] text-[var(--color-ink-soft)] group-hover/proof:text-[var(--color-ink)]">
                            {p.name[lang].split(' — ')[0]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!shown && (
              <p className="flex h-[126px] items-center justify-center text-[12px] text-[var(--color-ink-faint)]">
                {copy.empty[lang]}
              </p>
            )}
          </div>
        </div>

        {/* Scope, the closest thing we built, and the hand-off, in one strip */}
        {/* Fixed-width scope block (fits the longest scope word), the closest
            project takes what is left, the button keeps its size. */}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="w-[9.5rem] shrink-0">
            <p className="whitespace-nowrap font-display text-xl leading-tight text-[var(--color-ink)]">
              {chosen.length ? copy.scopes[lang][scope] : '—'}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              {/* One continuous bar filling with the weight of what is ticked */}
              <div
                className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-line)]"
                role="meter"
                aria-label={copy.scope[lang]}
                aria-valuemin={0}
                aria-valuemax={12}
                aria-valuenow={Math.min(weight, 12)}
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-accent)] transition-[width] duration-500 ease-out"
                  style={{ width: `${(Math.min(weight, 12) / 12) * 100}%` }}
                />
              </div>
              <span className="shrink-0 font-mono text-[10px] text-[var(--color-ink-faint)]">
                {chosen.length} {copy.features[lang]}
              </span>
            </div>
          </div>
          {closest ? (
            <button
              type="button"
              onClick={() => onOpen(closest.p)}
              title={copy.closest[lang]}
              className="group flex min-w-0 flex-1 items-center gap-2.5 text-left"
            >
              <span className="h-9 w-14 shrink-0 overflow-hidden rounded-md border border-[var(--color-line)] bg-[var(--color-canvas)]">
                {closest.p.status !== 'private' && closest.p.image && (
                  <img src={closest.p.image} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                )}
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                  {lang === 'pl' ? 'Najbliżej' : 'Closest'} · {closest.n}/{chosen.length}
                </span>
                <span className="block truncate text-[13px] font-semibold text-[var(--color-ink)] group-hover:underline">
                  {closest.p.name[lang].split(' — ')[0]}
                </span>
              </span>
            </button>
          ) : (
            <span className="flex-1" />
          )}
          <button
            type="button"
            onClick={toBrief}
            disabled={chosen.length === 0}
            className="group flex min-h-11 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full xl:w-auto bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-on-accent)] transition-all hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] active:scale-[0.98] disabled:opacity-40"
          >
            {copy.toBrief[lang]}
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
