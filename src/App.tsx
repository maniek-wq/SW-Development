import { useEffect, useState, useRef, type ReactNode } from 'react'
import { motion, useSpring, useMotionValueEvent } from 'framer-motion'
import { type Lang, type Project, categories, projects, t, services, teamMembers, processSteps, testimonials } from './content'

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
    <div className="min-h-screen">
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
          <Contact lang={lang} />
        </Reveal>
      </main>

      <Footer lang={lang} />

      {open && <CaseStudy p={open} lang={lang} onClose={() => setOpen(null)} />}
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
  const [activeSection, setActiveSection] = useState<string>('')

  // Bendable navbar border: the vertical pill's right edge dips into a notch
  // beside the hovered link. We draw the outline as an SVG path and clip the
  // glass to it.
  const barRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [navOpen, setNavOpen] = useState(false)

  const goToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  const [bar, setBar] = useState({ w: 0, h: 0 })
  const [outline, setOutline] = useState('')
  const notchY = useSpring(0, { stiffness: 420, damping: 34 })
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
    const r = W / 2
    const hw = 20 // half-height of the notch mouth
    const dep = notchDepth.get() // bump depth to the right
    const y = Math.max(r + hw, Math.min(H - r - hw, notchY.get()))
    return (
      `M 0 ${r} A ${r} ${r} 0 0 1 ${W} ${r} ` +
      `V ${y - hw} C ${W} ${y - hw * 0.55} ${W + dep} ${y - hw * 0.5} ${W + dep} ${y} ` +
      `C ${W + dep} ${y + hw * 0.5} ${W} ${y + hw * 0.55} ${W} ${y + hw} ` +
      `V ${H - r} A ${r} ${r} 0 0 1 0 ${H - r} V ${r} Z`
    )
  }

  useEffect(() => setOutline(buildOutline()), [bar])
  useMotionValueEvent(notchY, 'change', () => setOutline(buildOutline()))
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
    const cy = lr.top - br.top + lr.height / 2
    if (notchDepth.get() < 0.5) notchY.jump(cy)
    else notchY.set(cy)
    notchDepth.set(12)
  }, [hoveredKey, bar])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

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

      {/* Vertical nav pill glued to the middle of the left margin */}
      <div
        ref={barRef}
        onMouseEnter={() => setNavOpen(true)}
        onMouseLeave={() => {
          setNavOpen(false)
          setHoveredKey(null)
        }}
        style={outline ? { clipPath: `path('${outline}')` } : undefined}
        className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 bg-[var(--color-canvas)]/55 py-3 pl-2 pr-3 backdrop-blur-2xl backdrop-saturate-150 [filter:drop-shadow(0_12px_28px_rgba(20,22,26,0.18))] lg:flex"
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

        {(['work', 'about', 'testimonials', 'contact'] as const).map((k) => {
          const isActive = activeSection === k
          return (
            <a
              key={k}
              ref={(el) => {
                linkRefs.current[k] = el
              }}
              href={`#${k}`}
              onClick={(e) => goToSection(e, k)}
              onMouseEnter={() => setHoveredKey(k)}
              title={t.nav[k][lang]}
              className={`relative flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-[var(--color-ink)]'
                  : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg bg-[var(--color-surface)] shadow-sm border border-[var(--color-line)]"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                {navIcons[k]}
              </span>
              <span
                className={`relative z-10 overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  navOpen ? 'ml-3 max-w-[10rem] opacity-100' : 'ml-0 max-w-0 opacity-0'
                }`}
              >
                {t.nav[k][lang]}
              </span>
            </a>
          )
        })}
      </div>
    </>
  )
}

/* -------------------------------------------------------------- FlipCard */

function FlipCard({ lang }: { lang: Lang }) {
  const faces = [
    {
      tag: { pl: 'Studio', en: 'Studio' },
      name: 'SW Development',
      role: t.role[lang],
    },
    {
      tag: { pl: 'Zespół', en: 'Team' },
      name: { pl: 'Maja', en: 'Maja' },
      role: { pl: 'UX/UI & Front-end', en: 'UX/UI & Front-end' },
    },
    {
      tag: { pl: 'Zespół', en: 'Team' },
      name: { pl: 'Współzałożyciel', en: 'Co-founder' },
      role: { pl: 'Development & Security', en: 'Development & Security' },
    },
    {
      tag: { pl: 'Zespół', en: 'Team' },
      name: { pl: 'Analityk biznesowy', en: 'Business Analyst' },
      role: { pl: 'Discovery & Kontakt z klientem', en: 'Discovery & Client Contact' },
    },
  ]

  const resolve = (v: string | { pl: string; en: string }) =>
    typeof v === 'string' ? v : v[lang]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), 2000)
    return () => clearInterval(id)
  }, [])

  // The front face shows even steps, the back face shows odd steps, so the
  // content swaps while a face is turned away from the viewer.
  const frontStep = index % 2 === 0 ? index : index - 1
  const backStep = index % 2 === 1 ? index : index - 1
  const front = faces[((frontStep % faces.length) + faces.length) % faces.length]
  const back = faces[((backStep % faces.length) + faces.length) % faces.length]

  const Face = ({ data, back }: { data: typeof faces[number]; back?: boolean }) => (
    <div
      className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-surface)] p-5 shadow-[0_28px_55px_-22px_rgba(20,22,26,0.45)]"
      style={{ backfaceVisibility: 'hidden', transform: back ? 'rotateY(180deg)' : undefined }}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] font-display text-sm font-bold tracking-tight text-white">
          SW
        </span>
        <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-canvas)] px-2 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
          {resolve(data.tag)}
        </span>
      </div>
      <div>
        <p className="font-display text-lg font-semibold leading-tight tracking-tight text-[var(--color-ink)]">
          {resolve(data.name)}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
          {resolve(data.role)}
        </p>
      </div>
    </div>
  )

  return (
    <div className="pointer-events-none absolute right-0 top-9 hidden select-none lg:block" style={{ perspective: 1200 }} aria-hidden="true">
      <div className="relative h-44 w-64">
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: index * 180 }}
          transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
        >
          <Face data={front} />
          <Face data={back} back />
        </motion.div>
        <div className="absolute -bottom-6 left-1/2 h-5 w-40 -translate-x-1/2 rounded-full bg-[var(--color-ink)]/15 blur-md" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ Hero */

function Hero({ lang }: { lang: Lang }) {
  return (
    <section id="hero" className="relative overflow-hidden py-12 sm:py-20">
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

      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
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

function Card({ p, lang, onOpen }: { p: Project; lang: Lang; onOpen: () => void }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,22,26,0.35)]">
      <button onClick={onOpen} className="relative block aspect-[16/11] overflow-hidden text-left">
        <div className="absolute inset-0" style={{ background: p.color, opacity: 0.08 }} />
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur"
          style={{ background: `color-mix(in srgb, ${p.color} 82%, black 18%)` }}
        >
          {categories.find((c) => c.key === p.category)?.label[lang]}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight">{p.name}</h3>
          <span className="font-mono text-xs text-[var(--color-ink-faint)]">{p.year}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
          {p.tagline[lang]}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.stack.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-md bg-[var(--color-canvas)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-ink-soft)]"
            >
              {s}
            </span>
          ))}
        </div>

        <div
          className="mt-4 flex items-center gap-2 pt-4"
          style={{ borderTop: '1px solid var(--color-line)' }}
        >
          <button
            onClick={onOpen}
            className="flex-1 rounded-lg bg-[var(--color-ink)] px-3 py-2 text-sm font-semibold text-[var(--color-canvas)] transition-all hover:brightness-125 active:scale-[0.98]"
          >
            {t.caseStudy[lang]}
          </button>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-label={t.viewLive[lang]}
            className="rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-canvas)]"
          >
            ↗
          </a>
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
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
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
              {p.name}
            </h2>
            <span className="font-mono text-sm text-[var(--color-ink-faint)]">{p.year}</span>
          </div>
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

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
            {p.liveUrl ? (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {t.viewLive[lang]}
              </a>
            ) : (
              <button
                disabled
                className="flex-1 rounded-xl bg-[var(--color-line)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-ink-faint)] cursor-not-allowed"
              >
                {t.viewLive[lang]}
              </button>
            )}
            
            {p.repoUrl ? (
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl border border-[var(--color-line-strong)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-canvas)]"
              >
                {t.viewCode[lang]}
              </a>
            ) : (
              <button
                disabled
                className="flex-1 rounded-xl border border-[var(--color-line)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-ink-faint)] cursor-not-allowed"
              >
                {t.viewCode[lang]}
              </button>
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

/* --------------------------------------------------------------- Contact */

function Contact({ lang }: { lang: Lang }) {
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
      <a
        href="mailto:hello@swdevelopment.dev"
        className="mt-7 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#14161a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {t.email[lang]}
      </a>
      <p className="mt-6 font-mono text-xs text-white/50">hello@swdevelopment.dev</p>
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
