import { useEffect, useState, useRef, type ReactNode } from 'react'
import { motion, useSpring, useMotionValueEvent } from 'framer-motion'
import {
  type Lang,
  type LS,
  type Project,
  type FaceIcon,
  type StackItem,
  type TeamMember,
  categories,
  projects,
  t,
  services,
  teamMembers,
  processSteps,
  testimonials,
} from './content'

/* --------------------------------------------------------------- Reveal */

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* --------------------------------------------------------------- About Us */

function AboutUsSection({ lang }: { lang: Lang }) {
  return (
    <section id="about" className="pt-20 pb-10">
      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          {t.aboutSectionTitle[lang]}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-soft)] sm:text-base">
          {t.aboutSectionBody[lang]}
        </p>
      </div>

      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <article key={member.name.en} className="group relative overflow-hidden rounded-2xl bg-[var(--color-line)] shadow-sm lg:aspect-square">
            <div className="aspect-square overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
              <img
                src={member.image}
                alt={member.name[lang]}
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            {/* Static info below the photo on mobile / tablet (no hover available) */}
            <div className="border-t border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-[var(--color-ink)] lg:hidden">
              <div>
                <h3 className="font-display text-lg font-semibold">{member.name[lang]}</h3>
                <span className="mt-1 block whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{member.role[lang]}</span>
              </div>
              <div className="mt-4 space-y-2 border-t border-[var(--color-line)] pt-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                <p>{member.education[lang]}</p>
                <p>{member.bio[lang]}</p>
              </div>
            </div>
            {/* Hover-reveal overlay on large screens */}
            <div className="absolute inset-x-0 bottom-0 hidden translate-y-[calc(100%-3.5rem)] border-t border-white/20 bg-[rgba(17,20,27,0.88)] p-5 text-white backdrop-blur-md transition-transform duration-500 ease-out group-hover:translate-y-0 lg:block">
              <div>
                <h3 className="font-display text-lg font-semibold">{member.name[lang]}</h3>
                <span className="mt-1 block whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">{member.role[lang]}</span>
              </div>
              <div className="mt-4 space-y-2 border-t border-white/15 pt-4 text-sm leading-relaxed text-white/80">
                <p>{member.education[lang]}</p>
                <p>{member.bio[lang]}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item, i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition-all hover:shadow-md">
            <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">
              {item.title[lang]}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {item.description[lang]}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 pt-4" style={{ borderTop: '1px solid var(--color-line)' }}>
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-[var(--color-canvas)] px-2 py-1 font-mono text-[11px] text-[var(--color-ink-soft)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- Process */

function ProcessSection({ lang }: { lang: Lang }) {
  return (
    <section id="process" className="py-16 sm:py-20">
      <div className="flex flex-col gap-3 border-b border-[var(--color-line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {lang === 'pl' ? 'Jak współpracujemy' : 'How we work'}
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {lang === 'pl' ? 'Proces w stałym kontakcie' : 'A process built on close contact'}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[var(--color-ink-soft)]">
          {lang === 'pl'
            ? 'Każdy etap ma jasny cel, wspólną decyzję i miejsce na Twoją informację zwrotną.'
            : 'Every stage has a clear goal, a shared decision, and room for your feedback.'}
        </p>
      </div>

      <div className="relative mt-8">
        <div className="absolute left-0 right-0 top-4 hidden h-px bg-[var(--color-line)] lg:block" aria-hidden="true" />
        <ol className="grid gap-0 border-l border-[var(--color-line)] pl-7 sm:grid-cols-2 sm:border-l-0 sm:pl-0 lg:grid-cols-5">
          {processSteps.map((step, index) => (
            <li key={step.id} className="relative pb-8 last:pb-0 sm:pr-8 sm:odd:pr-4 lg:pb-0 lg:pr-5">
              <span className="absolute -left-[2.15rem] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-surface)] font-mono text-[11px] font-semibold text-[var(--color-accent)] sm:-left-4 lg:left-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="pt-10 lg:pt-14">
                <h3 className="font-display text-base font-semibold text-[var(--color-ink)]">{step.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{step.description[lang]}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- Testimonials */

function TestimonialsSection({ lang }: { lang: Lang }) {
  return (
    <section id="testimonials" className="pt-20 pb-10">
      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          {t.testimonialsTitle[lang]}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-soft)] sm:text-base">
          {t.testimonialsBody[lang]}
        </p>
      </div>

      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-8 pt-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:snap-none sm:gap-6 sm:overflow-visible sm:px-0">
        {testimonials.map((testim, i) => (
          <div
            key={i}
            className="flex w-[85vw] shrink-0 snap-center flex-col justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition-all hover:-translate-y-1 hover:shadow-lg sm:w-auto"
          >
            <p className="text-sm italic leading-relaxed text-[var(--color-ink-soft)]">
              "{testim.text[lang]}"
            </p>
            <div className="mt-8 flex items-center gap-3">
              <img
                src={testim.avatar}
                alt={testim.name}
                loading="lazy"
                className="h-10 w-10 shrink-0 rounded-full bg-[var(--color-line)] object-cover grayscale transition-all hover:grayscale-0"
              />
              <div className="flex flex-col">
                <span className="font-display text-sm font-semibold text-[var(--color-ink)]">
                  {testim.name}
                </span>
                <span className="text-xs text-[var(--color-ink-faint)]">
                  {testim.role[lang]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>('pl')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filter, setFilter] = useState<'all' | Project['category']>('all')
  const [open, setOpen] = useState<Project | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const shown = projects.filter((p) => filter === 'all' || p.category === filter)

  return (
    <div className="min-h-screen overflow-x-clip">
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <main className="mx-auto w-full max-w-6xl px-5 pt-16 sm:px-8">
        <Reveal>
          <Hero lang={lang} />
        </Reveal>

        {/* Filters */}
        <Reveal delay={100}>
          <div
            className="sticky top-[72px] z-30 -mx-5 flex items-center gap-2 overflow-x-auto border-b border-[var(--color-line)] bg-[var(--color-canvas)]/90 px-5 py-3 backdrop-blur sm:top-[76px] sm:mx-0 sm:rounded-full sm:border sm:px-2 sm:py-2 relative"
          >
            {categories.map((c) => {
              const isActive = filter === c.key
              return (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className={`relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[var(--color-canvas)]'
                      : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="filter-active"
                      className="absolute inset-0 rounded-full bg-[var(--color-ink)]"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{c.label[lang]}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Work grid */}
        <section id="work" className="pt-6">
          <Reveal delay={200}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {t.workTitle[lang]}
              </h2>
              <span className="font-mono text-xs text-[var(--color-ink-faint)]">
                {shown.length} {t.workCount[lang]}
              </span>
            </div>
          </Reveal>

          {/* Said once, above the grid — the cards already carry their own badges. */}
          <Reveal delay={250}>
            <p className="mb-6 flex max-w-2xl items-start gap-2.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
              <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
              <span>
                {t.workNote[lang]}{' '}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-line-strong)] underline-offset-4 transition-colors hover:decoration-[var(--color-accent)]"
                >
                  {t.workNoteCta[lang]}
                </a>
              </span>
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <Reveal key={p.id} delay={i * 75}>
                <Card p={p} lang={lang} onOpen={() => setOpen(p)} />
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <AboutUsSection lang={lang} />
        </Reveal>

        <Reveal>
          <ProcessSection lang={lang} />
        </Reveal>

        <Reveal>
          <TestimonialsSection lang={lang} />
        </Reveal>

        <Reveal>
          <Contact lang={lang} onOpenForm={() => setFormOpen(true)} />
        </Reveal>
      </main>

      <Footer lang={lang} />

      {open && <CaseStudy p={open} lang={lang} onClose={() => setOpen(null)} />}
      {formOpen && <ContactDialog lang={lang} onClose={() => setFormOpen(false)} />}
    </div>
  )
}

/* ---------------------------------------------------------------- Header */

const navIcons: Record<string, ReactNode> = {
  work: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <circle cx="9" cy="8" r="3" />
      <path d="M15 11a3 3 0 1 0 0-6" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M17 15c2.5.4 4 2.3 4 5" />
    </svg>
  ),
  testimonials: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M12 3l2.5 5.3 5.5.8-4 4 1 5.6L12 21l-5-2.3 1-5.6-4-4 5.5-.8z" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
}

function Header({
  lang,
  setLang,
  theme,
  setTheme,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}) {
  // Bendable navbar border: the horizontal pill's bottom edge dips into a notch
  // below the hovered link. We draw the outline as an SVG path and clip the
  // glass to it.
  const barRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [navOpen, setNavOpen] = useState(false)

  // The pill unfolds on its own once the page is scrolled past the hero fold,
  // and folds back to icons at the top. Hovering still unfolds it anywhere.
  const [scrolled, setScrolled] = useState(false)
  const expanded = navOpen || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  const [bar, setBar] = useState({ w: 0, h: 0 })
  const [outline, setOutline] = useState('')
  const notchX = useSpring(0, { stiffness: 420, damping: 34 })
  const notchDepth = useSpring(0, { stiffness: 420, damping: 30 })

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const measure = () => setBar({ w: el.offsetWidth, h: el.offsetHeight })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => ro.disconnect()
  }, [])

  const buildOutline = () => {
    const { w: W, h: H } = bar
    if (W <= 0 || H <= 0) return ''
    const r = H / 2
    const hw = 20 // half-width of the notch mouth
    const dep = notchDepth.get() // bump depth downwards
    const x = Math.max(r + hw, Math.min(W - r - hw, notchX.get()))
    return (
      `M ${r} 0 H ${W - r} A ${r} ${r} 0 0 1 ${W - r} ${H} ` +
      `H ${x + hw} C ${x + hw * 0.55} ${H} ${x + hw * 0.5} ${H + dep} ${x} ${H + dep} ` +
      `C ${x - hw * 0.5} ${H + dep} ${x - hw * 0.55} ${H} ${x - hw} ${H} ` +
      `H ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`
    )
  }

  useEffect(() => setOutline(buildOutline()), [bar])
  useMotionValueEvent(notchX, 'change', () => setOutline(buildOutline()))
  useMotionValueEvent(notchDepth, 'change', () => setOutline(buildOutline()))

  useEffect(() => {
    const el = barRef.current
    const link = hoveredKey ? linkRefs.current[hoveredKey] : null
    if (!el || !link) {
      notchDepth.set(0)
      return
    }
    const br = el.getBoundingClientRect()
    const lr = link.getBoundingClientRect()
    const cx = lr.left - br.left + lr.width / 2
    if (notchDepth.get() < 0.5) notchX.jump(cx)
    else notchX.set(cx)
    notchDepth.set(12)
  }, [hoveredKey, bar])

  return (
    <>
      {/* Persistent controls, fixed to the top-right corner */}
      <div className="fixed right-4 top-3 z-50 flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-canvas)]/80 text-[var(--color-ink-soft)] backdrop-blur-xl transition-colors hover:text-[var(--color-ink)]"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="flex items-center rounded-full border border-[var(--color-line)] bg-[var(--color-canvas)]/80 p-0.5 font-mono text-[11px] font-semibold backdrop-blur-xl relative">
          {(['pl', 'en'] as const).map((l) => {
            const isActive = lang === l
            return (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`relative rounded-full px-2.5 py-1.5 uppercase transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-[var(--color-ink-faint)] hover:text-[var(--color-ink-soft)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="lang-active"
                    className="absolute inset-0 -z-0 rounded-full bg-[var(--color-accent)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Brand, fixed to the top-left corner */}
      <div className="fixed left-4 top-3 z-50 flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-[var(--color-canvas)]/80 py-1.5 pl-1.5 pr-4 backdrop-blur-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] font-display text-[11px] font-bold text-white">
          SW
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-sm font-semibold">{t.brand[lang]}</span>
          <span className="hidden text-[11px] text-[var(--color-ink-faint)] sm:block">{t.role[lang]}</span>
        </div>
      </div>

      {/* Horizontal nav pill: a thumb-reachable dock at the bottom on phones and
          tablets, moving up into the top band next to brand and controls on
          desktop, where there is room for it beside them. */}
      <div
        ref={barRef}
        onMouseEnter={() => setNavOpen(true)}
        onMouseLeave={() => {
          setNavOpen(false)
          setHoveredKey(null)
        }}
        style={outline ? { clipPath: `path('${outline}')` } : undefined}
        className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 flex-row items-center gap-1 bg-[var(--color-canvas)]/55 px-2 py-1.5 backdrop-blur-2xl backdrop-saturate-150 [filter:drop-shadow(0_12px_28px_rgba(20,22,26,0.18))] lg:bottom-auto lg:top-3"
      >
        {/* The pill's own bendable outline */}
        <svg
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
          width={bar.w}
          height={bar.h}
          aria-hidden="true"
        >
          <path d={outline} fill="none" stroke="var(--color-line-strong)" strokeWidth={1.25} />
        </svg>

        {(['work', 'about', 'testimonials', 'contact'] as const).map((k) => (
          <a
            key={k}
            ref={(el) => {
              linkRefs.current[k] = el
            }}
            href={`#${k}`}
            onClick={(e) => goToSection(e, k)}
            onMouseEnter={() => setHoveredKey(k)}
            title={t.nav[k][lang]}
            aria-label={t.nav[k][lang]}
            className="relative flex items-center rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
          >
            <span className="relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
              {navIcons[k]}
            </span>
            {/* Labels unfold from lg up only: expanded, the pill is wider than a
                phone screen, so the dock stays icons-only below that. */}
            <span
              className={`relative z-10 ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ${
                expanded ? 'lg:ml-3 lg:max-w-[10rem] lg:opacity-100' : ''
              }`}
            >
              {t.nav[k][lang]}
            </span>
          </a>
        ))}
      </div>
    </>
  )
}

/* -------------------------------------------------------------- FlipCard */

/** Small glyphs for the tools listed on each card face. */
const faceIcons: Record<FaceIcon, ReactNode> = {
  figma: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="M5 4h7v16" />
      <circle cx="17" cy="8" r="4" />
      <path d="M5 12h7" />
    </svg>
  ),
  motion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="M3 18c5 0 5-12 10-12s5 6 8 6" />
      <circle cx="13" cy="6" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="m12 3 8 4.5-8 4.5-8-4.5z" />
      <path d="m4 14 8 4.5 8-4.5" />
    </svg>
  ),
  key: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9" />
      <path d="M17 12v3.5" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="M13 2 4.5 13H11l-1 9 8.5-11H12z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </svg>
  ),
  flow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <rect x="3" y="3" width="6" height="5" rx="1.2" />
      <rect x="15" y="16" width="6" height="5" rx="1.2" />
      <path d="M6 8v7a3 3 0 0 0 3 3h6" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  ),
}

type FaceTheme = 'studio' | TeamMember['theme']

/** One hue per discipline; the texture, the badge and the role line share it. */
const faceHues: Record<FaceTheme, string> = {
  studio: 'var(--color-accent)',
  design: '#7c3aed',
  security: 'var(--color-positive)',
  analysis: 'var(--color-warn)',
}

// Fixed, not random: the rain has to look the same on every render so the two
// card faces never disagree mid-flip.
const rainColumns = [
  '01001011010011010110100101',
  '11010010110100101101001011',
  '10110100101100110100101101',
  '01101001011010010110100110',
  '10010110100110101101001011',
  '11001011010010110100101100',
  '01011010011010010110101101',
  '10100101101001011011001010',
  '01101101001011010010110100',
  '10010110101101001011010011',
  '11010110100101100101101001',
  '00101101001101011010010110',
]

function FaceTexture({ theme, hue }: { theme: FaceTheme; hue: string }) {
  if (theme === 'security') {
    return (
      <div
        className="absolute inset-0 overflow-hidden opacity-[0.22] [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_70%,transparent)]"
        aria-hidden="true"
      >
        <div className="flex h-full justify-between px-1">
          {rainColumns.map((column, i) => (
            <span
              key={i}
              className="block w-[1ch] break-all font-mono text-[9px] leading-[11px] [animation:flip-card-rain_linear_infinite]"
              style={{ color: hue, animationDuration: `${5 + i * 0.7}s` }}
            >
              {column + column}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (theme === 'design') {
    return (
      <svg
        viewBox="0 0 160 110"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-[0.28]"
        aria-hidden="true"
      >
        {[18, 46, 74, 102, 130].map((x) => (
          <rect key={x} x={x} y="0" width="12" height="110" fill={hue} opacity="0.14" />
        ))}
        {[24, 48, 72, 96].map((y) => (
          <line key={y} x1="0" y1={y} x2="160" y2={y} stroke={hue} strokeWidth="0.4" opacity="0.4" />
        ))}
        <path d="M6 94 C 44 94 40 32 82 32 S 126 72 154 20" fill="none" stroke={hue} strokeWidth="1.3" opacity="0.8" />
        <circle cx="82" cy="32" r="2.8" fill={hue} />
        <circle cx="6" cy="94" r="2" fill={hue} />
        <circle cx="154" cy="20" r="2" fill={hue} />
      </svg>
    )
  }

  if (theme === 'analysis') {
    return (
      <svg
        viewBox="0 0 160 110"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-[0.28]"
        aria-hidden="true"
      >
        <line x1="8" y1="96" x2="152" y2="96" stroke={hue} strokeWidth="0.6" opacity="0.6" />
        {[
          [18, 62],
          [44, 44],
          [70, 70],
          [96, 30],
          [122, 50],
        ].map(([x, y]) => (
          <rect key={x} x={x} y={y} width="14" height={96 - y} fill={hue} opacity="0.16" />
        ))}
        <polyline
          points="25,70 51,52 77,60 103,24 129,38"
          fill="none"
          stroke={hue}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        {[
          [25, 70],
          [51, 52],
          [77, 60],
          [103, 24],
          [129, 38],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="2" fill={hue} />
        ))}
      </svg>
    )
  }

  return (
    <div
      className="absolute inset-0 opacity-[0.16]"
      style={{
        backgroundImage: `radial-gradient(${hue} 0.9px, transparent 1px)`,
        backgroundSize: '11px 11px',
      }}
      aria-hidden="true"
    />
  )
}

function FlipCard({ lang }: { lang: Lang }) {
  const faces: {
    tag: string | LS
    name: string | LS
    role: string | LS
    theme: FaceTheme
    stack: StackItem[]
  }[] = [
    {
      tag: { pl: 'Studio', en: 'Studio' },
      name: 'SW Development',
      role: t.role[lang],
      theme: 'studio',
      stack: [
        { icon: 'layers', label: { pl: 'Projektowanie', en: 'Design' } },
        { icon: 'shield', label: { pl: 'Development', en: 'Development' } },
        { icon: 'target', label: 'Discovery' },
      ],
    },
    ...teamMembers.map((member) => ({
      tag: { pl: 'Zespół', en: 'Team' },
      name: member.name,
      role: member.role,
      theme: member.theme,
      stack: member.stack,
    })),
  ]

  const resolve = (v: string | { pl: string; en: string }) =>
    typeof v === 'string' ? v : v[lang]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), 3000)
    return () => clearInterval(id)
  }, [])

  // The front face shows even steps, the back face shows odd steps, so the
  // content swaps while a face is turned away from the viewer.
  const frontStep = index % 2 === 0 ? index : index - 1
  const backStep = index % 2 === 1 ? index : index - 1
  const front = faces[((frontStep % faces.length) + faces.length) % faces.length]
  const back = faces[((backStep % faces.length) + faces.length) % faces.length]

  const Face = ({ data, back }: { data: typeof faces[number]; back?: boolean }) => {
    const hue = faceHues[data.theme]
    return (
      <div
        className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-surface)] p-5 shadow-[0_34px_65px_-24px_rgba(20,22,26,0.45)]"
        style={{ backfaceVisibility: 'hidden', transform: back ? 'rotateY(180deg)' : undefined }}
      >
        <FaceTexture theme={data.theme} hue={hue} />

        <div className="relative z-10 flex items-start justify-between">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-base font-bold tracking-tight text-white"
            style={{ backgroundColor: hue }}
          >
            SW
          </span>
          <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-canvas)] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
            {resolve(data.tag)}
          </span>
        </div>

        <div className="relative z-10">
          {/* The studio name pings like a radar contact; the people's names stay put. */}
          <p
            className={`font-display text-lg font-semibold leading-tight tracking-tight text-[var(--color-ink)] xl:text-xl ${
              data.theme === 'studio' ? '[animation:radar-ping_2.6s_ease-out_infinite]' : ''
            }`}
          >
            {resolve(data.name)}
          </p>
          {/* The hue lives on the badge, the chips and the texture; on text this
              small it fails contrast against the dark surface, so the role is ink. */}
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink)] xl:text-[11px]">
            {resolve(data.role)}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {data.stack.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--color-line)] bg-[var(--color-canvas)]/85 px-1.5 py-[3px] font-mono text-[9px] leading-none text-[var(--color-ink-soft)] xl:text-[10px]"
              >
                <span style={{ color: hue }}>{faceIcons[item.icon]}</span>
                {resolve(item.label)}
              </span>
            ))}
          </div>

          {/* The same line on every face, so it reads as the studio's motto
              rather than a caption belonging to one person. */}
          <p className="mt-3 border-t border-[var(--color-line)] pt-2.5 text-[10px] font-medium leading-snug text-[var(--color-ink)] xl:text-[11px]">
            {t.motto[lang]}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="pointer-events-none absolute -right-4 top-6 hidden select-none lg:block xl:-right-14"
      style={{ perspective: 1400 }}
      aria-hidden="true"
    >
      <div className="relative h-52 w-[19rem] xl:h-64 xl:w-[23rem]">
        {/* Static tilt wrapper: the flip below spins inside this tilted frame */}
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(4deg) rotateY(8deg) rotateZ(1.5deg)',
          }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: index * 180 }}
            transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
          >
            <Face data={front} />
            <Face data={back} back />
          </motion.div>
        </div>
        <div className="absolute -bottom-8 left-1/2 h-6 w-52 -translate-x-1/2 rounded-full bg-[var(--color-ink)]/15 blur-lg" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ Hero */

function Hero({ lang }: { lang: Lang }) {
  // Overflow stays visible so the flip card's shadow can spill past the
  // content column; the page root clips horizontally instead.
  return (
    <section id="hero" className="relative py-12 sm:py-20">
      <FlipCard lang={lang} />

      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-positive)] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-positive)]" />
        </span>
        {t.available[lang]}
      </span>

      <p className="mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-accent)]">
        {t.role[lang]}
      </p>

      {/* Narrower from lg up so the headline clears the flip card in the corner */}
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:max-w-xl xl:max-w-2xl">
        {t.heroTitle[lang]}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
        {t.heroBody[lang]}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="#work"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="rounded-xl bg-[var(--color-accent)] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
        >
          {t.cta[lang]}
        </a>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-surface)] px-5 py-3 text-center text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-canvas)]"
        >
          {t.ctaContact[lang]}
        </a>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Card */

function LockIcon({ className, stroke }: { className: string; stroke?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke ?? 'currentColor'}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

/** Cover for a project whose preview is withheld — no screenshot exists to show. */
function LockedCover({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2"
      style={{ background: `color-mix(in srgb, ${color} 12%, var(--color-surface))` }}
    >
      <LockIcon className="h-7 w-7" stroke={color} />
      <span className="font-mono text-[11px] text-[var(--color-ink-soft)]">{label}</span>
    </div>
  )
}

const statusStyles: Record<NonNullable<Project['status']>, { label: keyof typeof t; className: string }> = {
  // Withheld reads neutral, in-flight reads amber, and the one that invites a
  // conversation is the only badge allowed to use the positive colour.
  private: {
    label: 'statusPrivate',
    className: 'border-[var(--color-line-strong)] bg-[var(--color-canvas)] text-[var(--color-ink-soft)]',
  },
  ongoing: {
    label: 'statusOngoing',
    className: 'border-[var(--color-warn)]/40 bg-[var(--color-warn)]/10 text-[var(--color-warn)]',
  },
  forSale: {
    label: 'statusForSale',
    className: 'border-[var(--color-positive)]/40 bg-[var(--color-positive)]/10 text-[var(--color-positive)]',
  },
}

function StatusBadge({ status, lang }: { status: NonNullable<Project['status']>; lang: Lang }) {
  const style = statusStyles[status]
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium backdrop-blur ${style.className}`}
    >
      {(t[style.label] as LS)[lang]}
    </span>
  )
}

function Card({ p, lang, onOpen }: { p: Project; lang: Lang; onOpen: () => void }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,22,26,0.35)]">
      <button onClick={onOpen} className="relative block aspect-[16/11] w-full overflow-hidden text-left">
        <div className="absolute inset-0" style={{ background: p.color, opacity: 0.08 }} />
        {p.status === 'private' || !p.image ? (
          <LockedCover color={p.color} label={t.previewBlocked[lang]} />
        ) : (
          <img
            src={p.image}
            alt={p.name[lang]}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur"
          style={{ background: `color-mix(in srgb, ${p.color} 82%, black 18%)` }}
        >
          {categories.find((c) => c.key === p.category)?.label[lang]}
        </span>
        {p.status && (
          <span className="absolute right-3 top-3">
            <StatusBadge status={p.status} lang={lang} />
          </span>
        )}
      </button>

      {/* Every zone below has a reserved height, so cards match across rows too —
          grid stretching alone only evens out cards within a single row. */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex min-h-[3.5rem] items-baseline justify-between gap-3">
          <h3 className="line-clamp-2 font-display text-lg font-semibold tracking-tight">
            {p.name[lang]}
          </h3>
          <span className="shrink-0 font-mono text-xs text-[var(--color-ink-faint)]">{p.year}</span>
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-[2.85rem] text-sm leading-relaxed text-[var(--color-ink-soft)]">
          {p.tagline[lang]}
        </p>

        <div className="mt-3 mb-4 flex h-[1.4rem] items-center gap-1.5 overflow-hidden">
          {p.stack.slice(0, 2).map((s) => (
            <span
              key={s}
              className="shrink-0 whitespace-nowrap rounded-md bg-[var(--color-canvas)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-ink-soft)]"
            >
              {s}
            </span>
          ))}
          {p.stack.length > 2 && (
            <span className="shrink-0 font-mono text-[11px] text-[var(--color-ink-faint)]">
              +{p.stack.length - 2}
            </span>
          )}
        </div>

        <div
          className="mt-auto flex items-center gap-2 pt-4"
          style={{ borderTop: '1px solid var(--color-line)' }}
        >
          <button
            onClick={onOpen}
            className="flex-1 rounded-lg bg-[var(--color-ink)] px-3 py-2 text-sm font-semibold text-[var(--color-canvas)] transition-all hover:brightness-125 active:scale-[0.98]"
          >
            {t.caseStudy[lang]}
          </button>
          {/* Only a real link earns an arrow; the rest of the work is not public. */}
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.viewLive[lang]}
              className="rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-canvas)]"
            >
              ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------- CaseStudy */

function CaseStudy({ p, lang, onClose }: { p: Project; lang: Lang; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-[rgba(18,20,25,0.6)]"
        style={{ animation: 'fade-in 0.25s ease' }}
        onClick={onClose}
      />
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[var(--color-surface)] shadow-2xl sm:rounded-3xl"
        style={{ animation: 'tour-pop 0.35s cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div className="relative max-h-[38vh] shrink-0 overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
          <div className="absolute inset-0" style={{ background: p.color, opacity: 0.1 }} />
          {p.status === 'private' || !p.image ? (
            <LockedCover color={p.color} label={t.previewBlocked[lang]} />
          ) : (
            <img src={p.image} alt={p.name[lang]} className="h-full w-full object-cover object-top" />
          )}
          <button
            onClick={onClose}
            aria-label={t.close[lang]}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {p.name[lang]}
            </h2>
            <span className="font-mono text-sm text-[var(--color-ink-faint)]">{p.year}</span>
          </div>
          {p.status && (
            <div className="mt-3">
              <StatusBadge status={p.status} lang={lang} />
            </div>
          )}
          <p className="mt-2 text-base text-[var(--color-ink-soft)]">{p.tagline[lang]}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[var(--color-line)] py-5 sm:grid-cols-3">
            <Meta label={t.roleLabel[lang]} value={p.role[lang]} />
            <Meta label={t.yearLabel[lang]} value={p.year} />
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
                {t.stackLabel[lang]}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-[var(--color-canvas)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-ink-soft)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
              {t.aboutLabel[lang]}
            </h3>
            <p className="mt-2 leading-relaxed text-[var(--color-ink-soft)]">{p.about[lang]}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
              {t.highlightsLabel[lang]}
            </h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {p.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: p.color }}
                  />
                  <span className="text-[var(--color-ink)]">{h[lang]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* A disabled button says nothing; when there is no link, say why. */}
          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {t.viewLive[lang]}
              </a>
            )}
            {p.repoUrl && (
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl border border-[var(--color-line-strong)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-canvas)]"
              >
                {t.viewCode[lang]}
              </a>
            )}
            {!p.liveUrl && !p.repoUrl && (
              <p className="flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-4 py-3 text-center text-sm text-[var(--color-ink-soft)]">
                {p.status === 'private'
                  ? t.privateNote[lang]
                  : p.status === 'ongoing'
                    ? t.ongoingNote[lang]
                    : p.status === 'forSale'
                      ? t.forSaleNote[lang]
                      : t.commercialNote[lang]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">{value}</p>
    </div>
  )
}

/* ---------------------------------------------------------- ContactForm */

const CONTACT_EMAIL = 'hello@swdevelopment.dev'

/**
 * Formspree endpoint, e.g. https://formspree.io/f/xyzabcd — set
 * VITE_FORMSPREE_ENDPOINT in the deployment environment. Without it the form
 * falls back to opening the visitor's mail client, so the dialog is never a
 * dead end.
 */
const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined

type SendState = 'idle' | 'sending' | 'sent' | 'mailed' | 'failed'

function ContactDialog({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<SendState>('idle')

  useEffect(() => {
    // Hand focus to the dialog, give it back to whatever opened it, and keep
    // the page behind from scrolling while it is open.
    const opener = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstFieldRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      opener?.focus?.()
    }
  }, [])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([type="hidden"]), textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable || focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent(`${t.formTitle[lang]} — ${data.get('name') ?? ''}`)
      const body = encodeURIComponent(`${data.get('message') ?? ''}\n\n${data.get('email') ?? ''}`)
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
      setState('mailed')
      return
    }

    setState('sending')
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      setState(response.ok ? 'sent' : 'failed')
    } catch {
      setState('failed')
    }
  }

  // Floating label: the label rests inside the empty field and rides up into the
  // top border once the field is focused or filled. The hint only shows on focus,
  // so it never collides with the resting label.
  const fieldClass =
    'peer w-full rounded-xl border border-[var(--color-line-strong)] bg-transparent px-3.5 py-3 text-sm text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] placeholder:opacity-0 focus:border-[var(--color-accent)] focus:placeholder:opacity-100'
  const labelBase =
    'pointer-events-none absolute left-2.5 z-10 px-1 text-sm text-[var(--color-ink-faint)] transition-all duration-150'
  const labelFloat =
    'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-[var(--color-surface)] peer-[:not(:placeholder-shown)]:text-[11px] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-[var(--color-surface)] peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-[var(--color-accent)]'
  const inputLabelClass = `${labelBase} top-1/2 -translate-y-1/2 ${labelFloat}`
  const textareaLabelClass = `${labelBase} top-3 ${labelFloat}`

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6" onKeyDown={onKeyDown}>
      <div
        className="absolute inset-0 bg-[rgba(18,20,25,0.6)]"
        style={{ animation: 'fade-in 0.25s ease' }}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
        className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl bg-[var(--color-surface)] p-6 shadow-2xl sm:rounded-3xl sm:p-8"
        style={{ animation: 'tour-pop 0.3s cubic-bezier(0.22,1,0.36,1)' }}
      >
        <button
          onClick={onClose}
          aria-label={t.close[lang]}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-canvas)] hover:text-[var(--color-ink)]"
        >
          ✕
        </button>

        {state === 'sent' || state === 'mailed' ? (
          <div className="py-6 text-center">
            <span
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-2xl"
              style={{ background: 'color-mix(in srgb, var(--color-positive) 16%, transparent)' }}
              aria-hidden="true"
            >
              ✓
            </span>
            <h2 id="contact-form-title" className="mt-4 font-display text-xl font-semibold tracking-tight">
              {t.formSentTitle[lang]}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {state === 'mailed' ? t.formMailFallback[lang] : t.formSentBody[lang]}
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-canvas)] transition-all hover:brightness-125 active:scale-[0.98]"
            >
              {t.close[lang]}
            </button>
          </div>
        ) : (
          <>
            <h2 id="contact-form-title" className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              {t.formTitle[lang]}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">{t.formBody[lang]}</p>

            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
              {/* Bot bait: Formspree drops anything that fills this in. */}
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <div className="relative">
                <input
                  ref={firstFieldRef}
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={t.formNameHint[lang]}
                  className={fieldClass}
                />
                <label htmlFor="contact-name" className={inputLabelClass}>
                  {t.formName[lang]}
                </label>
              </div>

              <div className="relative">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t.formEmailHint[lang]}
                  className={fieldClass}
                />
                <label htmlFor="contact-email" className={inputLabelClass}>
                  {t.formEmail[lang]}
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder={t.formMessageHint[lang]}
                  className={`resize-y ${fieldClass}`}
                />
                <label htmlFor="contact-message" className={textareaLabelClass}>
                  {t.formMessage[lang]}
                </label>
              </div>

              {state === 'failed' && (
                <p role="alert" className="text-sm leading-relaxed text-[var(--color-warn)]">
                  {t.formFailed[lang]}
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'sending'}
                className="mt-1 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'sending' ? t.formSending[lang] : state === 'failed' ? t.formRetry[lang] : t.formSend[lang]}
              </button>
            </form>

            <p className="mt-5 text-center font-mono text-xs text-[var(--color-ink-faint)]">
              {t.formOr[lang]}{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[var(--color-ink-soft)] underline underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
/* --------------------------------------------------------------- Contact */

function Contact({ lang, onOpenForm }: { lang: Lang; onOpenForm: () => void }) {
  return (
    <section
      id="contact"
      className="my-14 overflow-hidden rounded-3xl border border-white/10 px-6 py-12 text-center sm:px-12 sm:py-16"
      style={{ background: 'linear-gradient(135deg, #1b1e27 0%, #14161a 55%, #201b3a 100%)' }}
    >
      <h2 className="mx-auto max-w-xl font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
        {t.contactTitle[lang]}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
        {t.contactBody[lang]}
      </p>
      <button
        onClick={onOpenForm}
        className="mt-7 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#14161a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {t.email[lang]}
      </button>
      {/* The address stays visible: some people would rather use their own mail client. */}
      <p className="mt-6 font-mono text-xs text-white/50">
        <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-white/80">
          {CONTACT_EMAIL}
        </a>
      </p>
    </section>
  )
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-[var(--color-ink-faint)] sm:flex-row sm:px-8">
      <span>© 2025 {t.brand[lang]}</span>
      <div className="flex gap-4">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-ink-soft)]">
          GitHub
        </a>
        <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-ink-soft)]">
          Dribbble
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-ink-soft)]">
          LinkedIn
        </a>
      </div>
    </footer>
  )
}
