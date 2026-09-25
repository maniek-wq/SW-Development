import { useEffect, useMemo, useState, useRef, type ReactNode } from 'react'
import {
  motion,
  MotionConfig,
  useScroll,
  useSpring,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
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
  shownTestimonials,
  faq,
  type FaqAuthor,
  sectionKeys,
  sectionNumbers,
} from './content'
import { SWMark, SectionHeader, finePointer, scrollToSection, useDragScroll } from './ui'
import { isTypingTarget, useDialog } from './dialog'
import HangingBadges from './components/HangingBadges'
import AppBuilder from './components/AppBuilder'
import ProcessStory from './components/ProcessStory'
import BriefTicket from './components/BriefTicket'
import CommandPalette, { paletteShortcut } from './components/CommandPalette'
import IdeaPrompt from './components/IdeaPrompt'

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

/* --------------------------------------------------------- Page effects */

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer()) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mouse-x', `${e.clientX}px`)
        el.style.setProperty('--mouse-y', `${e.clientY}px`)
        el.style.opacity = '1'
        raf = 0
      })
    }
    const onLeave = () => (el.style.opacity = '0')
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <div ref={ref} id="cursor-glow" aria-hidden="true" />
}

/**
 * Pointer tilt with a moving glare, after the collectible card on
 * sitekmikolaj.pl — dialled down so a grid of these stays calm.
 */
function Tilt({ children, className = '', max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const spring = { stiffness: 160, damping: 18, mass: 0.4 }
  const rotateX = useSpring(0, spring)
  const rotateY = useSpring(0, spring)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || reduce || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    rotateX.set((0.5 - py) * max * 2)
    rotateY.set((px - 0.5) * max * 2)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
    el.style.setProperty('--glare', '1')
  }
  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    ref.current?.style.setProperty('--glare', '0')
  }

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full"
      >
        {children}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: 'var(--glare, 0)',
            background:
              'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.22), transparent 55%)',
            mixBlendMode: 'soft-light',
          }}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  )
}

/* --------------------------------------------------------------- About Us */

function AboutUsSection({ lang }: { lang: Lang }) {
  return (
    <section id="about" className="pt-24 pb-10 sm:pt-32">
      <SectionHeader
        index={sectionNumbers.about}
        label={t.sectionAbout[lang]}
        title={t.aboutSectionTitle[lang]}
        aside={t.aboutSectionBody[lang]}
      />

      <div className="mb-20">
        <HangingBadges members={teamMembers} lang={lang} />
      </div>

      <div className="grid border-t border-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item, i) => (
          <div
            key={i}
            className="group flex flex-col border-b border-[var(--color-line)] py-8 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <span className="font-display text-sm italic text-[var(--color-accent-ink)]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 font-display text-2xl font-normal text-[var(--color-ink)]">
              <span className="accent-line accent-line-lead">{item.title[lang]}</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{item.description[lang]}</p>
            <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1.5 pt-6">
              {item.skills.map((skill) => (
                <span key={skill} className="font-mono text-[11px] text-[var(--color-ink-faint)]">
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

/* -------------------------------------------------------------- Builder */

function BuilderSection({ lang, onOpen }: { lang: Lang; onOpen: (p: Project) => void }) {
  return (
    <section id="stack" className="pt-10 pb-10 sm:pt-12">
      <SectionHeader
        index={sectionNumbers.stack}
        label={t.nav.stack[lang]}
        title={lang === 'pl' ? 'Złóż swoją aplikację' : 'Put your app together'}
        aside={
          lang === 'pl'
            ? 'Zaznacz, czego potrzebujesz. Zobaczysz, jak to może wyglądać, czym to zbudujemy i gdzie już to zrobiliśmy.'
            : 'Tick what you need. See how it could look, what we would build it with and where we have done it before.'
        }
      />
      <AppBuilder lang={lang} onOpen={onOpen} />
    </section>
  )
}

/* ----------------------------------------------------------- Testimonials */

// Reference letters, the kind Polish businesses actually write: a stack of
// paper, one on top, the rest fanned behind it. Click the stack, use the
// arrows or the index, or (on touch) swipe the top letter away, and the next
// one comes forward. Each letter is the client's words over a small
// before / after record, signed with their role.
function Signature({ seed }: { seed: number }) {
  // A pen stroke, varied per letter so no two signatures are the same line.
  const w = [8, 14, 6, 11, 9][seed % 5]
  return (
    <svg viewBox="0 0 160 44" className="h-10 w-36 text-[var(--color-ink)]" fill="none" aria-hidden="true">
      <path
        d={`M4 30 C 18 ${6 + w}, 26 40, 38 22 S 56 ${10 + w}, 62 30 S 80 36, 90 ${18 + w / 2} S 108 12, 116 28 S 138 34, 156 ${16 + w}`}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TestimonialsSection({ lang }: { lang: Lang }) {
  const letters = shownTestimonials
  const [top, setTop] = useState(0)
  const n = letters.length
  const go = (d: number) => setTop((t) => (t + d + n) % n)
  const L = letters[top]

  return (
    <section id="testimonials" className="pt-24 pb-10 sm:pt-32">
      <SectionHeader
        index={sectionNumbers.testimonials}
        label={t.sectionTestimonials[lang]}
        title={t.testimonialsTitle[lang]}
        aside={t.testimonialsBody[lang]}
      />

      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        {/* The index of letters */}
        <div className="order-2 lg:order-1">
          <ol className="border-t border-[var(--color-line)]">
            {letters.map((r, i) => (
              <li key={r.projectId}>
                <button
                  onClick={() => setTop(i)}
                  aria-current={i === top ? 'true' : undefined}
                  className="group relative flex w-full items-baseline gap-4 border-b border-[var(--color-line)] py-3.5 text-left"
                >
                  {i === top && (
                    <motion.span
                      layoutId="letter-index"
                      className="absolute -left-4 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-[var(--color-accent)] max-lg:hidden"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className={`font-mono text-[10px] ${i === top ? 'text-[var(--color-accent-ink)]' : 'text-[var(--color-ink-faint)]'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-display text-lg leading-tight transition-colors ${
                      i === top ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] group-hover:text-[var(--color-ink)]'
                    }`}
                  >
                    {r.sector[lang]}
                  </span>
                  <span className="ml-auto truncate font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] max-sm:hidden">
                    {r.role[lang]}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex items-center gap-3">
            {[-1, 1].map((d) => (
              <button
                key={d}
                onClick={() => go(d)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line-strong)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
                aria-label={d < 0 ? (lang === 'pl' ? 'Poprzedni list' : 'Previous letter') : lang === 'pl' ? 'Następny list' : 'Next letter'}
              >
                <span aria-hidden="true">{d < 0 ? '←' : '→'}</span>
              </button>
            ))}
            <span className="ml-2 font-mono text-[11px] text-[var(--color-ink-faint)]">
              {String(top + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* The stack */}
        <div className="relative order-1 mx-auto w-full max-w-[460px] pb-6 pr-6 lg:order-2" aria-live="polite">
          <div className="relative aspect-[1/1.18] w-full sm:aspect-[1/1.12]">
            {letters.map((r, i) => {
              const depth = (i - top + n) % n
              const onTop = depth === 0
              return (
                <motion.article
                  key={r.projectId}
                  aria-hidden={!onTop}
                  onClick={() => !onTop && setTop(i)}
                  drag={onTop ? 'x' : false}
                  dragSnapToOrigin
                  onDragEnd={(_, info) => Math.abs(info.offset.x) > 90 && go(info.offset.x < 0 ? 1 : -1)}
                  animate={{
                    x: depth * 12,
                    y: depth * 10,
                    rotate: onTop ? -1.2 : [0, 2.2, -1.6, 3, -2.4][depth % 5],
                    scale: 1 - Math.min(depth, 3) * 0.035,
                    opacity: depth > 3 ? 0 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  style={{ zIndex: n - depth }}
                  className={`absolute inset-0 flex flex-col overflow-hidden rounded-[3px] border border-[var(--color-line)] bg-[var(--color-canvas)] text-[var(--color-ink)] shadow-[0_24px_40px_-24px_rgba(20,20,20,0.55)] ${
                    onTop ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                  }`}
                >
                  {/* The paper: the surface tint over an opaque sheet, so the letters behind never show through */}
                  <div className="flex flex-1 flex-col bg-[var(--color-surface)] px-6 py-6 sm:px-9 sm:py-8">
                    <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
                      <span>{lang === 'pl' ? 'List referencyjny' : 'Letter of reference'}</span>
                      <span>SW/REF/{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="mt-4 border-b border-[var(--color-line-strong)] pb-4">
                      <p className="font-display text-2xl leading-none sm:text-3xl">{r.sector[lang]}</p>
                    </div>

                    <p className="mt-5 font-display text-[17px] leading-snug sm:text-lg">„{r.quote[lang]}”</p>

                    {/* The record: before and after, as a form would have it */}
                    <dl className="mt-5 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-[12.5px] leading-snug max-sm:hidden">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{lang === 'pl' ? 'Przed' : 'Before'}</dt>
                      <dd className="text-[var(--color-ink-soft)]">{r.before[lang]}</dd>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent-ink)]">{lang === 'pl' ? 'Po' : 'After'}</dt>
                      <dd className="text-[var(--color-ink)]">{r.after[lang]}</dd>
                    </dl>

                    <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                      <div>
                        <Signature seed={i} />
                        <p className="mt-1 border-t border-[var(--color-line-strong)] pt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                          {r.name ? `${r.name}, ${r.role[lang]}` : r.role[lang]}
                        </p>
                      </div>
                      {/* Not yet signed off: a rubber stamp, dev only */}
                      {!r.approved && (
                        <span className="mb-2 rotate-[-10deg] rounded border-2 border-[var(--color-warn)] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-warn)] opacity-80">
                          {lang === 'pl' ? 'Szkic' : 'Draft'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
          <p className="sr-only">
            {L.sector[lang]}: {L.quote[lang]}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ FAQ */

// Every answer comes from a person: the one on the team who handles that
// topic, with their photo from the Team section. The questions sit on the
// left; the answer card on the right changes person and text together, and
// its button asks that person directly (the contact form opens addressed to
// them). On phones the card sits under the list.
const faqAuthors: Record<FaqAuthor, number> = { mikolaj: 0, jakub: 1, wojciech: 2 }

function FaqSection({ lang, onAsk }: { lang: Lang; onAsk: (message: string) => void }) {
  const [active, setActive] = useState(0)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onFaq = (e: Event) => {
      const i = (e as CustomEvent<number>).detail
      if (typeof i === 'number' && faq[i]) setActive(i)
    }
    window.addEventListener('sw-faq', onFaq)
    return () => window.removeEventListener('sw-faq', onFaq)
  }, [])

  const pick = (i: number) => {
    setActive(i)
    // On a phone the answer is below the list: bring it into view.
    if (window.matchMedia('(max-width: 1023px)').matches) card.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const f = faq[active]
  const who = teamMembers[faqAuthors[f.by]]
  const first = who.name[lang].split(' ')[0]

  return (
    <section id="faq" className="pt-24 pb-10 sm:pt-32">
      <SectionHeader index={sectionNumbers.faq} label={t.sectionFaq[lang]} title={t.faqTitle[lang]} aside={t.faqBody[lang]} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <ol className="border-t border-[var(--color-line)]">
          {faq.map((q, i) => {
            const on = i === active
            const person = teamMembers[faqAuthors[q.by]]
            return (
              <li key={q.q.en}>
                <button
                  onClick={() => pick(i)}
                  aria-pressed={on}
                  className="group flex w-full items-center gap-4 border-b border-[var(--color-line)] py-3.5 text-left"
                >
                  <span className={`font-mono text-[10px] ${on ? 'text-[var(--color-accent-ink)]' : 'text-[var(--color-ink-faint)]'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`flex-1 text-[15px] transition-colors ${
                      on ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] group-hover:text-[var(--color-ink)]'
                    }`}
                  >
                    {q.q[lang]}
                  </span>
                  {/* Who answers it, as a small face */}
                  <img
                    src={person.image}
                    alt=""
                    className={`h-6 w-6 shrink-0 rounded-full object-cover transition-[filter,opacity] ${on ? 'opacity-100' : 'opacity-50 grayscale group-hover:opacity-80'}`}
                  />
                </button>
              </li>
            )
          })}
        </ol>

        <div ref={card} className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active + lang}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-3.5">
                  <img src={who.image} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--color-accent)]/40" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-ink)]">{who.name[lang]}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{who.role[lang]}</p>
                  </div>
                </div>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent-ink)]">{f.q[lang]}</p>
                <p className="mt-2 font-display text-xl leading-snug text-[var(--color-ink)] sm:text-2xl">{f.a[lang]}</p>
                <button
                  onClick={() =>
                    onAsk(lang === 'pl' ? `Pytanie do: ${who.name[lang]}\n\n` : `A question for ${who.name[lang]}\n\n`)
                  }
                  className="group mt-7 inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-4 text-sm text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)]"
                >
                  {lang === 'pl' ? `Zapytaj ${first === 'Jakub' ? 'Jakuba' : first === 'Mikołaj' ? 'Mikołaja' : 'Wojciecha'} o coś innego` : `Ask ${first} something else`}
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                    →
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ App */

export default function App() {
  const [lang, setLang] = useState<Lang>('pl')
  // index.html has already set the class before the first paint; start from it.
  const [theme, setThemeState] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )
  // A choice made on the page is remembered; until then the system decides.
  const setTheme = (next: 'light' | 'dark' | ((th: 'light' | 'dark') => 'light' | 'dark')) =>
    setThemeState((th) => {
      const value = typeof next === 'function' ? next(th) : next
      try {
        localStorage.setItem('sw-theme', value)
      } catch {
        // Not remembered; fine.
      }
      return value
    })
  const [filter, setFilter] = useState<'all' | Project['category']>('all')
  const [open, setOpen] = useState<Project | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  // Text the contact form opens with — the brief ticket writes its summary here.
  const [formMessage, setFormMessage] = useState('')
  const openForm = (message = '') => {
    setFormMessage(message)
    setFormOpen(true)
  }
  const paletteActions = useMemo(
    () => ({
      openForm: () => openForm(),
      openProject: (p: Project) => setOpen(p),
      toggleTheme: () => setTheme((th) => (th === 'light' ? 'dark' : 'light')),
      toggleLang: () => setLang((l) => (l === 'pl' ? 'en' : 'pl')),
      email: CONTACT_EMAIL,
    }),
    []
  )

  // The looks to choose between: Aurora (default, no attribute), Papier and
  // Swiss. index.html applies a saved choice before the first paint.
  const [skin, setSkinState] = useState<Skin>(() => {
    const saved = document.documentElement.dataset.skin as Skin | undefined
    return saved && skins.includes(saved) ? saved : 'aurora'
  })
  const setSkin = (next: Skin) => {
    setSkinState(next)
    if (next === 'aurora') delete document.documentElement.dataset.skin
    else document.documentElement.dataset.skin = next
    try {
      localStorage.setItem('sw-skin', next)
    } catch {
      // Not remembered; fine.
    }
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const follow = () => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem('sw-theme')
      } catch {
        // No storage: always follow the system.
      }
      if (!saved) setThemeState(media.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', follow)
    return () => media.removeEventListener('change', follow)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const shown = projects.filter((p) => filter === 'all' || p.category === filter)

  // A shorter filter shrinks the grid under the reader, who would otherwise be
  // left further down the page (in About us). Bring them back to the grid top.
  const gridRef = useRef<HTMLDivElement>(null)
  const pickFilter = (key: typeof filter) => {
    setFilter(key)
    const grid = gridRef.current
    if (grid && grid.getBoundingClientRect().top < 140) {
      window.scrollTo({ top: grid.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' })
    }
  }

  // reducedMotion="user": every framer animation below honours the OS setting.
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-clip">
        <CursorGlow />
        <CommandPalette lang={lang} actions={paletteActions} />
        <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} skin={skin} setSkin={setSkin} />
        <ConceptDock skin={skin} setSkin={setSkin} lang={lang} />

        <main className="relative z-[2]">
          <div className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-8">
            <Hero lang={lang} onOpenForm={() => openForm()} onOpen={setOpen} />
          </div>

          <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
            {/* Work grid */}
            <section id="work" className="pt-20 sm:pt-24">
              <Reveal>
                <SectionHeader
                  index={sectionNumbers.work}
                  label={t.sectionWork[lang]}
                  title={t.workTitle[lang]}
                  aside={
                    <span className="flex items-start gap-2.5">
                      <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                      <span>
                        {t.workNote[lang]}{' '}
                        <a
                          href="#contact"
                          onClick={(e) => {
                            e.preventDefault()
                            scrollToSection('contact')
                          }}
                          className="accent-line font-medium text-[var(--color-ink)]"
                        >
                          {t.workNoteCta[lang]}
                        </a>
                      </span>
                    </span>
                  }
                />
              </Reveal>

              {/* Filters: the active one carries the brand line instead of a fill. */}
              {/* Filters float as their own pill, clear of the masthead above them */}
              <div className="pointer-events-none sticky top-[74px] z-30 mb-10 flex justify-center">
              <div className="pointer-events-auto flex max-w-full items-center overflow-x-auto rounded-full border border-[var(--color-line-strong)] bg-[var(--color-canvas)]/85 px-1.5 shadow-[0_14px_30px_-20px_rgba(20,20,20,0.4)] backdrop-blur-md [scrollbar-width:none]">
                {categories.map((c) => {
                  const isActive = filter === c.key
                  return (
                    <button
                      key={c.key}
                      onClick={() => pickFilter(c.key)}
                      aria-pressed={isActive}
                      className={`relative min-h-11 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-[var(--color-ink)]'
                          : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                      }`}
                    >
                      {c.label[lang]}
                      {isActive && (
                        <motion.span
                          layoutId="filter-active"
                          className="absolute inset-x-3 bottom-2 h-[1.5px] bg-[var(--color-accent)]"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                    </button>
                  )
                })}
                <span className="ml-1 hidden shrink-0 border-l border-[var(--color-line)] py-1 pl-3 pr-3 font-mono text-[11px] text-[var(--color-ink-faint)] sm:block">
                  {String(shown.length).padStart(2, '0')} {t.workCount[lang]}
                </span>
              </div>
              </div>

              {/* Two to a row from tablets up: big enough to actually read a screenshot. */}
              <div ref={gridRef} className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-y-24">
                {shown.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 2) * 100}>
                    <Card p={p} index={projects.indexOf(p) + 1} lang={lang} onOpen={() => setOpen(p)} />
                  </Reveal>
                ))}
              </div>
            </section>

            <Reveal>
              <AboutUsSection lang={lang} />
            </Reveal>

            <ProcessStory lang={lang} />

            <Reveal>
              <BuilderSection lang={lang} onOpen={setOpen} />
            </Reveal>

            {shownTestimonials.length > 0 && (
              <Reveal>
                <TestimonialsSection lang={lang} />
              </Reveal>
            )}

            <Reveal>
              <FaqSection lang={lang} onAsk={(m) => openForm(m)} />
            </Reveal>

            <Contact lang={lang} onOpenForm={openForm} />
          </div>
        </main>

        <Footer lang={lang} />

        {open && (
          <CaseStudy
            p={open}
            list={shown.includes(open) ? shown : projects}
            lang={lang}
            onNavigate={setOpen}
            onClose={() => setOpen(null)}
          />
        )}
        {formOpen && <ContactDialog lang={lang} initialMessage={formMessage} onClose={() => setFormOpen(false)} />}
      </div>
    </MotionConfig>
  )
}

/* ---------------------------------------------------------------- Header */

const skins = ['aurora', 'papier', 'swiss'] as const
type Skin = (typeof skins)[number]
const skinNames: Record<Skin, string> = {
  aurora: 'Aurora',
  papier: 'Papier',
  swiss: 'Swiss',
}
const skinSwatch: Record<Skin, [string, string]> = {
  aurora: ['#07060d', '#7cf7d4'],
  papier: ['#f5f2ec', '#e4573f'],
  swiss: ['#f1efe9', '#ff3b1f'],
}
const skinBlurb: Record<Skin, LS> = {
  aurora: { pl: 'Nocne niebo, szkło, Syne', en: 'Night sky, glass, Syne' },
  papier: { pl: 'Papier, tusz, koral, Fraunces', en: 'Paper, ink, coral, Fraunces' },
  swiss: { pl: 'Szwajcarska typografia, czerwień', en: 'Swiss typography, red' },
}

/**
 * While the look is being chosen: a dock at the bottom of the page with every
 * look as a swatch, and ← → (with Alt) to step through them. Remove it, and
 * the looks that lost, once one is picked.
 */
function ConceptDock({ skin, setSkin, lang }: { skin: Skin; setSkin: (s: Skin) => void; lang: Lang }) {
  const [open, setOpen] = useState(true)
  const step = (d: number) => setSkin(skins[(skins.indexOf(skin) + d + skins.length) % skins.length])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || isTypingTarget(e)) return
      if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-canvas)]/90 p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 items-center gap-2 rounded-full px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          aria-expanded={open}
        >
          {lang === 'pl' ? 'Koncept' : 'Concept'}
          <span className="text-[var(--color-ink)]">
            {skins.indexOf(skin) + 1}/{skins.length}
          </span>
        </button>
        {open && (
          <>
            <button
              onClick={() => step(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-ink)]/[0.07] hover:text-[var(--color-ink)]"
              aria-label={lang === 'pl' ? 'Poprzedni wygląd' : 'Previous look'}
            >
              ←
            </button>
            {skins.map((s) => (
              <button
                key={s}
                onClick={() => setSkin(s)}
                title={`${skinNames[s]} — ${skinBlurb[s][lang]}`}
                aria-pressed={skin === s}
                className={`group/sw relative flex h-9 items-center gap-2 rounded-full pl-1.5 transition-colors ${
                  skin === s ? 'bg-[var(--color-ink)]/[0.08] pr-3' : 'pr-1.5 hover:bg-[var(--color-ink)]/[0.05]'
                }`}
              >
                <span
                  className={`h-6 w-6 rounded-full border ${skin === s ? 'border-[var(--color-accent)]' : 'border-black/15'}`}
                  style={{ background: `linear-gradient(135deg, ${skinSwatch[s][0]} 50%, ${skinSwatch[s][1]} 50%)` }}
                  aria-hidden="true"
                />
                {skin === s && <span className="text-[13px] text-[var(--color-ink)]">{skinNames[s]}</span>}
              </button>
            ))}
            <button
              onClick={() => step(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-ink)]/[0.07] hover:text-[var(--color-ink)]"
              aria-label={lang === 'pl' ? 'Następny wygląd' : 'Next look'}
            >
              →
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/** Steps to the next look; shows the current one. */
function SkinSwitch({ skin, setSkin, lang }: { skin: Skin; setSkin: (s: Skin) => void; lang: Lang }) {
  const other: Skin = skins[(skins.indexOf(skin) + 1) % skins.length]
  return (
    <button
      onClick={() => setSkin(other)}
      title={lang === 'pl' ? `Zmień wygląd na: ${skinNames[other]}` : `Switch look to: ${skinNames[other]}`}
      aria-label={lang === 'pl' ? `Wygląd strony: ${skinNames[skin]}. Zmień na ${skinNames[other]}` : `Site look: ${skinNames[skin]}. Switch to ${skinNames[other]}`}
      className="group/skin flex h-9 items-center gap-2 rounded-full border border-[var(--color-line-strong)] pl-1 pr-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
    >
      <span
        className="h-6 w-6 rounded-full border border-black/10 transition-transform duration-500 group-hover/skin:rotate-180"
        style={{ background: `linear-gradient(135deg, ${skinSwatch[skin][0]} 50%, ${skinSwatch[skin][1]} 50%)` }}
        aria-hidden="true"
      />
      {skinNames[skin]}
    </button>
  )
}

/** Width from which the section links sit in the bar instead of the menu. */
const NAV_INLINE = 1280

const navKeys = sectionKeys

/** Which nav section currently holds the middle of the viewport. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

function Header({
  lang,
  setLang,
  theme,
  setTheme,
  skin,
  setSkin,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  skin: Skin
  setSkin: (s: Skin) => void
}) {
  // A masthead, like the top of a printed page: the brand, the sections, and
  // a hairline underneath that fills with the accent as you read down the page.
  const activeKey = useActiveSection(navKeys)
  const [menuOpen, setMenuOpen] = useState(false)
  // The link under the pointer; a glass pill glides between hovered links.
  const [hoverKey, setHoverKey] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 })

  const menuRef = useRef<HTMLDivElement>(null)
  useDialog(menuRef, () => setMenuOpen(false), { open: menuOpen })

  // The full-page menu exists below the desktop layout only; if the screen
  // grows past it (a tablet turned sideways) while it is open, close it, or the
  // page would stay locked behind a menu that is no longer drawn.
  useEffect(() => {
    if (!menuOpen) return
    const wide = window.matchMedia(`(min-width: ${NAV_INLINE}px)`)
    const onChange = () => wide.matches && setMenuOpen(false)
    onChange()
    wide.addEventListener('change', onChange)
    return () => wide.removeEventListener('change', onChange)
  }, [menuOpen])

  const goToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToSection(id)
  }

  const langSwitch = (
    <div className="flex items-center font-mono text-[11px] font-medium uppercase tracking-[0.14em]">
      {(['pl', 'en'] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="px-1.5 text-[var(--color-line-strong)]">/</span>}
          <button
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`min-h-10 uppercase transition-colors ${
              lang === l ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)] hover:text-[var(--color-accent-ink)]'
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  )

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-[var(--color-canvas)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-[60px] w-full max-w-6xl items-center gap-6 px-4 sm:px-8 xl:gap-5">
          {/* Brand: on hover the logo's line stretches and the name lifts */}
          <a href="#hero" onClick={(e) => goToSection(e, 'hero')} className="group/brand flex shrink-0 items-center gap-3">
            <SWMark
              className="text-[19px] text-[var(--color-ink)]"
              line="h-[1.5px] transition-[width] duration-300 ease-out group-hover/brand:w-[1.9em]"
            />
            <span className="hidden font-display text-[15px] text-[var(--color-ink)] transition-transform duration-300 group-hover/brand:-translate-y-px group-hover/brand:text-[var(--color-accent-ink)] sm:block">
              {t.brand[lang]}
            </span>
          </a>

          <nav
            className="ml-auto hidden items-center gap-1 xl:flex"
            aria-label={lang === 'pl' ? 'Sekcje' : 'Sections'}
            onMouseLeave={() => setHoverKey(null)}
          >
            {navKeys.map((k) => (
              <a
                key={k}
                href={`#${k}`}
                onClick={(e) => goToSection(e, k)}
                aria-current={activeKey === k ? 'location' : undefined}
                onMouseEnter={() => setHoverKey(k)}
                className={`group relative flex h-[60px] items-center px-3 text-sm transition-colors ${
                  activeKey === k ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                }`}
              >
                {hoverKey === k && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-x-0 inset-y-3 rounded-full border border-[var(--color-line)] bg-[var(--color-ink)]/[0.06]"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative">{t.nav[k][lang]}</span>
                {/* A thin accent line grows under the hovered link */}
                {activeKey !== k && (
                  <span
                    className="absolute inset-x-3 bottom-[15px] h-px origin-left scale-x-0 bg-[var(--color-accent)] opacity-70 transition-transform duration-300 ease-out group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                )}
                {/* The section on screen gets a short accent line under its label, clear of the progress hairline at the bar edge */}
                {activeKey === k && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 bottom-[15px] h-[2px] rounded-full bg-[var(--color-accent)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4 xl:ml-1 xl:gap-3 xl:border-l xl:border-[var(--color-line)] xl:pl-5">
            {langSwitch}
            <span className="hidden sm:flex">
              <SkinSwitch skin={skin} setSkin={setSkin} lang={lang} />
            </span>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="group/theme flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-ink)]/[0.06] hover:text-[var(--color-accent-ink)]"
              aria-label={lang === 'pl' ? 'Przełącz motyw' : 'Toggle theme'}
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-[17px] w-[17px] transition-transform duration-500 group-hover/theme:-rotate-[20deg]">
                  <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-[17px] w-[17px] transition-transform duration-700 group-hover/theme:rotate-90">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              )}
            </button>
            {/* Search over the whole site (the command palette); keyboards get Ctrl/⌘ K for the same. */}
            <button
              onClick={() => window.dispatchEvent(new Event('sw-palette'))}
              className="group/k hidden h-9 items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-3 text-[13px] text-[var(--color-ink-soft)] transition-[color,border-color,box-shadow] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] hover:shadow-[0_0_18px_-6px_var(--color-accent)] xl:flex"
              aria-label={lang === 'pl' ? 'Szukaj na stronie' : 'Search the site'}
              title={`${lang === 'pl' ? 'Szukaj na stronie' : 'Search the site'} (${paletteShortcut})`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4 transition-colors group-hover/k:text-[var(--color-accent-ink)]" aria-hidden="true">
                <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4" />
              </svg>
              {lang === 'pl' ? 'Szukaj' : 'Search'}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex min-h-10 items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink)] xl:hidden"
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
            >
              Menu
              <span className="flex flex-col gap-[4px]" aria-hidden="true">
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* The hairline, filling with the accent as the page is read */}
        <div className="relative h-px bg-[var(--color-line)]">
          <motion.div
            className="absolute inset-0 origin-left bg-[var(--color-accent)]"
            style={{ scaleX: progress }}
            aria-hidden="true"
          />
        </div>
      </header>

      {/* Phones and tablets: a full page of contents, like a magazine's index */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="nav-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex flex-col bg-[var(--color-canvas)] xl:hidden"
          >
            <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-[var(--color-line)] px-4 sm:px-8">
              <SWMark className="text-[19px] text-[var(--color-ink)]" />
              <button
                onClick={() => setMenuOpen(false)}
                className="flex min-h-10 items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink)]"
              >
                {t.close[lang]} <span aria-hidden="true">✕</span>
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center px-4 sm:px-8" aria-label={lang === 'pl' ? 'Sekcje' : 'Sections'}>
              {navKeys.map((k, i) => (
                <motion.a
                  key={k}
                  href={`#${k}`}
                  onClick={(e) => goToSection(e, k)}
                  aria-current={activeKey === k ? 'location' : undefined}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] } }}
                  className="group flex items-baseline border-b border-[var(--color-line)] py-4"
                >
                  <span className="font-display text-4xl font-light text-[var(--color-ink)]">
                    <span className={activeKey === k ? 'accent-line accent-line-lead' : ''}>{t.nav[k][lang]}</span>
                  </span>
                  <span
                    className="ml-auto text-[var(--color-ink-faint)] transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-accent-ink)] group-active:translate-x-1 group-active:text-[var(--color-accent-ink)]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </motion.a>
              ))}
            </nav>
            <div className="flex items-center gap-3 px-4 pb-4 sm:px-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                {lang === 'pl' ? 'Wygląd' : 'Look'}
              </span>
              <SkinSwitch skin={skin} setSkin={setSkin} lang={lang} />
            </div>
            <p className="px-4 pb-8 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] sm:px-8">
              {t.brand[lang]} · {CONTACT_EMAIL}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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

/** Every face is drawn in the accent colour; the texture tells the disciplines apart. */
const FACE_HUE = 'var(--color-accent)'

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
        className="absolute inset-0 overflow-hidden opacity-[0.2] [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_70%,transparent)]"
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
        className="absolute inset-0 h-full w-full opacity-[0.3]"
        aria-hidden="true"
      >
        {[18, 46, 74, 102, 130].map((x) => (
          <rect key={x} x={x} y="0" width="12" height="110" fill={hue} opacity="0.12" />
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
        className="absolute inset-0 h-full w-full opacity-[0.3]"
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
          <rect key={x} x={x} y={y} width="14" height={96 - y} fill={hue} opacity="0.14" />
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
      className="absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage: `radial-gradient(${hue} 0.9px, transparent 1px)`,
        backgroundSize: '11px 11px',
      }}
      aria-hidden="true"
    />
  )
}

/** One face of the flipping business card. */
type FaceData = {
  tag: string | LS
  name: string | LS
  role: string | LS
  theme: FaceTheme
  stack: StackItem[]
}

function Face({ data, back, lang }: { data: FaceData; back?: boolean; lang: Lang }) {
  const resolve = (v: string | LS) => (typeof v === 'string' ? v : v[lang])
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--color-line-strong)] p-5 shadow-[0_34px_65px_-24px_rgba(20,20,20,0.4)]"
      style={{
        backfaceVisibility: 'hidden',
        transform: back ? 'rotateY(180deg)' : undefined,
        // Opaque, unlike the glass surfaces: the watermark and the sky must not
        // show through behind the text.
        background:
          'linear-gradient(160deg, color-mix(in srgb, var(--color-canvas) 90%, var(--color-accent) 10%), color-mix(in srgb, var(--color-canvas) 96%, var(--color-ink) 4%))',
      }}
    >
      {/* The texture covers the whole card; a scrim in the card's own colour
          darkens it behind the text so the words stay readable. */}
      <FaceTexture theme={data.theme} hue={FACE_HUE} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, color-mix(in srgb, var(--color-canvas) 88%, transparent) 0%, color-mix(in srgb, var(--color-canvas) 62%, transparent) 45%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start justify-between">
        <SWMark className="text-[28px] text-[var(--color-ink)]" />
        <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-canvas)] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
          {resolve(data.tag)}
        </span>
      </div>

      <div className="relative z-10">
        {/* The studio name pings the accent like a radar contact; the people's names stay put. */}
        <p
          className={`font-display text-xl leading-tight text-[var(--color-ink)] xl:text-2xl ${
            data.theme === 'studio' ? '[animation:radar-ping_2.6s_ease-out_infinite]' : ''
          }`}
        >
          {resolve(data.name)}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-soft)] xl:text-[11px]">
          {resolve(data.role)}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {data.stack.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-line)] bg-[var(--color-canvas)]/85 px-1.5 py-[3px] font-mono text-[9px] leading-none text-[var(--color-ink-soft)] xl:text-[10px]"
            >
              <span className="text-[var(--color-accent)]">{faceIcons[item.icon]}</span>
              {resolve(item.label)}
            </span>
          ))}
        </div>

        {/* The same line on every face, so it reads as the studio's promise
            rather than a caption belonging to one person. The motto itself is
            the hero headline now. */}
        <p className="mt-3 border-t border-[var(--color-line)] pt-2.5 font-display text-[11px] italic leading-snug text-[var(--color-ink)] xl:text-xs">
          {t.heroTitle[lang]}
        </p>
      </div>
    </div>
  )
}

function FlipCard({ lang }: { lang: Lang }) {
  const faces: FaceData[] = [
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

  const [index, setIndex] = useState(0)

  // The card is only drawn from lg up; below that neither the flip timer nor
  // the page-wide pointer listener runs.
  const [shown, setShown] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setShown(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!shown) return
    const id = setInterval(() => setIndex((i) => i + 1), 3200)
    return () => clearInterval(id)
  }, [shown])

  // The card leans toward the pointer anywhere on the page — the same spring
  // tilt as the collectible card on sitekmikolaj.pl, but driven from afar.
  const spring = { stiffness: 90, damping: 18, mass: 0.6 }
  const leanX = useSpring(0, spring)
  const leanY = useSpring(0, spring)
  useEffect(() => {
    if (!shown || !finePointer()) return
    const onMove = (e: MouseEvent) => {
      leanY.set((e.clientX / window.innerWidth - 0.5) * 14)
      leanX.set((0.5 - e.clientY / window.innerHeight) * 10)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [leanX, leanY, shown])

  // The front face shows even steps, the back face shows odd steps, so the
  // content swaps while a face is turned away from the viewer.
  const frontStep = index % 2 === 0 ? index : index - 1
  const backStep = index % 2 === 1 ? index : index - 1
  const front = faces[((frontStep % faces.length) + faces.length) % faces.length]
  const back = faces[((backStep % faces.length) + faces.length) % faces.length]

  if (!shown) return null

  return (
    <div
      className="pointer-events-none absolute -right-4 top-20 hidden select-none lg:block xl:-right-10"
      style={{ perspective: 1400 }}
      aria-hidden="true"
    >
      <div className="relative h-60 w-[19rem] xl:h-64 xl:w-[22rem]">
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d', rotateX: leanX, rotateY: leanY }}
        >
          {/* Static tilt wrapper: the flip below spins inside this tilted frame */}
          <div
            className="relative h-full w-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(4deg) rotateY(-8deg) rotateZ(-1.5deg)',
            }}
          >
            <motion.div
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: index * 180 }}
              transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            >
              <Face data={front} lang={lang} />
              <Face data={back} back lang={lang} />
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute -bottom-8 left-1/2 h-6 w-52 -translate-x-1/2 rounded-full bg-[var(--color-ink)]/15 blur-lg" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ Hero */

function Hero({ lang, onOpenForm, onOpen }: { lang: Lang; onOpenForm: () => void; onOpen: (p: Project) => void }) {
  const headline = t.heroHeadline[lang]
  const live = projects.filter((p) => p.liveUrl).length
  const trust = [
    `${projects.length} ${t.trustProjects[lang]}`,
    `${live} ${t.trustLive[lang]}`,
    t.trustStore[lang],
    t.trustTeam[lang],
  ]

  // Overflow stays visible so the flip card's shadow can spill past the
  // content column; the page root clips horizontally instead.
  return (
    <section id="hero" className="relative pb-12 pt-10 sm:pb-16 sm:pt-12">
      {/* The logo again, as a watermark far larger than the page. */}
      <span
        className="pointer-events-none absolute -right-[12vw] -top-10 select-none font-display text-[46vw] font-normal leading-none tracking-[-0.06em] text-[var(--color-ink)] opacity-[0.035] lg:-right-40 lg:text-[34rem]"
        aria-hidden="true"
      >
        SW
      </span>

      <FlipCard lang={lang} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <span className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-positive)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-positive)]" />
          </span>
          {t.available[lang]}
        </span>

        {/* Narrower from lg up so the headline clears the flip card in the corner */}
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(1.8rem,10vw,2.3rem)] font-light leading-[1.02] sm:text-7xl lg:max-w-[40rem] xl:max-w-[42rem] xl:text-[4.75rem]">
          {headline.before}{' '}
          <span className="relative inline-block whitespace-nowrap italic">
            {headline.mark}
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left bg-[var(--color-accent)] sm:h-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            />
          </span>{' '}
          {headline.after}
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
          {t.heroBody[lang]}
        </p>

        {/* The main call to action: describe the idea, see it read, take it to the builder */}
        <div className="mt-8">
          <IdeaPrompt lang={lang} onOpen={onOpen} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-2 px-4 text-sm">
          <button
            onClick={onOpenForm}
            className="group inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--color-ink)]"
          >
            <span className="accent-line">{t.ctaContact[lang]}</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </button>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('work')
            }}
            className="group inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            {t.cta[lang]}
            <span className="transition-transform group-hover:translate-y-0.5" aria-hidden="true">
              ↓
            </span>
          </a>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--color-line)] pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
          {trust.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="h-px w-3 bg-[var(--color-accent)]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
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
function LockedCover({ label }: { label: string }) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-[var(--color-canvas)]"
      style={{
        backgroundImage: 'repeating-linear-gradient(135deg, var(--color-line) 0 1px, transparent 1px 12px)',
      }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-surface)]">
        <LockIcon className="h-5 w-5 text-[var(--color-ink-soft)]" />
      </span>
      <span className="bg-[var(--color-canvas)] px-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
        {label}
      </span>
    </div>
  )
}

const statusStyles: Record<NonNullable<Project['status']>, { label: keyof typeof t; className: string }> = {
  // Withheld reads neutral, in-flight reads amber, and the one that invites a
  // conversation is the only badge allowed to use the positive colour.
  private: {
    label: 'statusPrivate',
    className: 'border-[var(--color-line-strong)] bg-[var(--color-surface)]/90 text-[var(--color-ink-soft)]',
  },
  ongoing: {
    label: 'statusOngoing',
    className: 'border-[var(--color-warn)]/40 bg-[var(--color-surface)]/90 text-[var(--color-warn)]',
  },
  forSale: {
    label: 'statusForSale',
    className: 'border-[var(--color-positive)]/40 bg-[var(--color-surface)]/90 text-[var(--color-positive)]',
  },
}

function StatusBadge({ status, lang }: { status: NonNullable<Project['status']>; lang: Lang }) {
  const style = statusStyles[status]
  return (
    <span className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium backdrop-blur ${style.className}`}>
      {(t[style.label] as LS)[lang]}
    </span>
  )
}

/** A screenshot shown whole, inside a quiet browser-window frame. */
function WindowFrame({ p, lang, children }: { p: Project; lang: Lang; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-surface)] shadow-[0_28px_50px_-30px_rgba(20,20,20,0.45)]">
      <div className="flex h-8 items-center gap-1.5 border-b border-[var(--color-line)] px-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-[var(--color-line-strong)]" />
        ))}
        <span className="ml-3 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
          {categories.find((c) => c.key === p.category)?.label[lang]}
        </span>
      </div>
      {children}
    </div>
  )
}

function Card({ p, index, lang, onOpen }: { p: Project; index: number; lang: Lang; onOpen: () => void }) {
  return (
    <article className="group flex h-full flex-col">
      <Tilt className="rounded-xl" max={3}>
        <WindowFrame p={p} lang={lang}>
          {/* Mouse shortcuts to the same case study as the title; keyboard and
              screen reader users get one stop per card, on the title. */}
          <button
            onClick={onOpen}
            tabIndex={-1}
            aria-hidden="true"
            className="relative block aspect-[16/10] w-full overflow-hidden text-left"
          >
            {p.status === 'private' || !p.image ? (
              <LockedCover label={t.previewBlocked[lang]} />
            ) : (
              <img
                src={p.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            )}
            {p.status && (
              <span className="absolute right-3 top-3">
                <StatusBadge status={p.status} lang={lang} />
              </span>
            )}
          </button>
        </WindowFrame>
      </Tilt>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-center justify-between font-mono text-[11px] text-[var(--color-ink-faint)]">
          <span>{String(index).padStart(2, '0')}</span>
          <span>{p.year}</span>
        </div>
        <h3 className="mt-2 font-display text-3xl font-normal leading-tight sm:text-4xl">
          <button onClick={onOpen} className="text-left" aria-label={`${t.caseStudy[lang]}: ${p.name[lang]}`}>
            <span className="accent-line accent-line-lead">{p.name[lang]}</span>
          </button>
        </h3>
        <p className="mt-3 line-clamp-2 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">{p.tagline[lang]}</p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {p.stack.slice(0, 4).map((s) => (
            <span key={s} className="whitespace-nowrap font-mono text-[11px] text-[var(--color-ink-faint)]">
              {s}
            </span>
          ))}
          {p.stack.length > 4 && (
            <span className="font-mono text-[11px] text-[var(--color-ink-faint)]">+{p.stack.length - 4}</span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-5 pt-5">
          <button
            onClick={onOpen}
            tabIndex={-1}
            aria-hidden="true"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--color-ink)]"
          >
            <span className="accent-line">{t.caseStudy[lang]}</span>
            <span aria-hidden="true">→</span>
          </button>
          {/* Only a real link earns an arrow; the rest of the work is not public. */}
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
            >
              {t.viewLive[lang]} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------- CaseStudy */

function CaseStudy({
  p,
  list,
  lang,
  onNavigate,
  onClose,
}: {
  p: Project
  list: Project[]
  lang: Lang
  onNavigate: (p: Project) => void
  onClose: () => void
}) {
  // Paging runs through the projects the grid is showing (the active filter),
  // wrapping round at either end; arrow keys do the same as the buttons.
  const at = Math.max(0, list.indexOf(p))
  const prev = list[(at - 1 + list.length) % list.length]
  const next = list[(at + 1) % list.length]
  const bodyRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const isTop = useDialog(dialogRef, onClose)

  // Arrows page only while this dialog is on top and nobody is typing (the
  // palette or the contact form may be open over it).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isTop() || isTypingTarget(e) || list.length < 2) return
      if (e.key === 'ArrowRight') onNavigate(next)
      else if (e.key === 'ArrowLeft') onNavigate(prev)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNavigate, next, prev, list.length, isTop])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [p])

  const pager = (dir: 'prev' | 'next') => (
    <button
      onClick={() => onNavigate(dir === 'prev' ? prev : next)}
      aria-label={dir === 'prev' ? (lang === 'pl' ? 'Poprzedni projekt' : 'Previous project') : lang === 'pl' ? 'Następny projekt' : 'Next project'}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141414]/60 text-[#f5f2ec] backdrop-blur transition-colors hover:bg-[#141414]/85"
    >
      <span aria-hidden="true">{dir === 'prev' ? '←' : '→'}</span>
    </button>
  )

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-[rgba(20,20,20,0.6)] backdrop-blur-sm"
        style={{ animation: 'fade-in 0.25s ease' }}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={p.name[lang]}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-[var(--color-surface)] shadow-2xl sm:rounded-2xl"
        style={{ animation: 'tour-pop 0.35s cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div
          className="relative max-h-[38vh] shrink-0 overflow-hidden border-b border-[var(--color-line)]"
          style={{ aspectRatio: '16 / 9' }}
        >
          {p.status === 'private' || !p.image ? (
            <LockedCover label={t.previewBlocked[lang]} />
          ) : (
            <img key={p.id} src={p.image} alt={p.name[lang]} className="h-full w-full object-cover object-top" style={{ animation: 'fade-in 0.3s ease' }} />
          )}
          {list.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              {pager('prev')}
              <span className="rounded-full bg-[#141414]/60 px-3 py-1.5 font-mono text-[11px] text-[#f5f2ec] backdrop-blur">
                {String(at + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
              </span>
              {pager('next')}
            </div>
          )}
          <button
            onClick={onClose}
            aria-label={t.close[lang]}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#141414]/60 text-[#f5f2ec] backdrop-blur transition-colors hover:bg-[#141414]/80"
          >
            ✕
          </button>
        </div>

        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-3xl font-normal leading-tight sm:text-4xl">{p.name[lang]}</h2>
            <span className="font-mono text-sm text-[var(--color-ink-faint)]">{p.year}</span>
          </div>
          <span className="mt-3 block h-[1.5px] w-12 bg-[var(--color-accent)]" aria-hidden="true" />
          {p.status && (
            <div className="mt-4">
              <StatusBadge status={p.status} lang={lang} />
            </div>
          )}
          <p className="mt-4 text-base text-[var(--color-ink-soft)]">{p.tagline[lang]}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[var(--color-line)] py-5 sm:grid-cols-3">
            <Meta label={t.roleLabel[lang]} value={p.role[lang]} />
            <Meta label={t.yearLabel[lang]} value={p.year} />
            <div className="col-span-2 sm:col-span-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
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

          {/* What it changed for the client comes first; the engineering follows. */}
          {p.results.length > 0 && (
            <div className="mt-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-accent-soft)] p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent-ink)]">
                {t.resultsLabel[lang]}
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {p.results.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--color-ink)]">
                    <span className="mt-[0.15em] shrink-0 font-semibold text-[var(--color-accent-ink)]" aria-hidden="true">
                      ✓
                    </span>
                    <span>{r[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
              {t.aboutLabel[lang]}
            </h3>
            <p className="mt-2 leading-relaxed text-[var(--color-ink-soft)]">{p.about[lang]}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
              {t.highlightsLabel[lang]}
            </h3>
            <ul className="mt-3 flex flex-col gap-3">
              {p.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span className="mt-[0.7em] h-[1.5px] w-3 shrink-0 bg-[var(--color-accent)]" />
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
                className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-on-accent)] transition-all hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] active:scale-[0.98]"
              >
                {t.viewLive[lang]} ↗
              </a>
            )}
            {p.repoUrl && (
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-[var(--color-line-strong)] px-4 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-canvas)]"
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

          {/* Read on: the next project, like the next article at the foot of a page */}
          {list.length > 1 && (
            <button
              onClick={() => onNavigate(next)}
              className="group mt-8 flex w-full items-center gap-4 border-t border-[var(--color-line)] pt-6 text-left"
            >
              <span className="h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-canvas)]">
                {next.status !== 'private' && next.image ? (
                  <img src={next.image} alt="" loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <span
                    className="block h-full w-full"
                    style={{ backgroundImage: 'repeating-linear-gradient(135deg, var(--color-line-strong) 0 1px, transparent 1px 7px)' }}
                  />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                  {lang === 'pl' ? 'Następny projekt' : 'Next project'} · {String(((at + 1) % list.length) + 1).padStart(2, '0')}
                </span>
                <span className="mt-1 block truncate font-display text-xl text-[var(--color-ink)]">
                  <span className="accent-line">{next.name[lang]}</span>
                </span>
              </span>
              <span className="text-lg text-[var(--color-ink-soft)] transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">{label}</p>
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

function ContactDialog({
  lang,
  initialMessage = '',
  onClose,
}: {
  lang: Lang
  initialMessage?: string
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<SendState>('idle')

  useDialog(dialogRef, onClose, { initialFocus: firstFieldRef })

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

  // Underlined fields, like the logo: the rule under a field takes the accent while
  // you type in it. The label rests in the field and rides up once it is
  // focused or filled; the hint only shows on focus.
  const fieldClass =
    'peer w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 pb-2.5 pt-6 text-base text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] placeholder:opacity-0 focus:border-[var(--color-accent)] focus:placeholder:opacity-100 focus-visible:outline-none'
  const labelClass =
    'pointer-events-none absolute left-0 top-[1.6rem] text-sm text-[var(--color-ink-faint)] transition-all duration-150 ' +
    'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:font-mono peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.14em] ' +
    'peer-focus:top-0 peer-focus:font-mono peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-[var(--color-accent-ink)]'

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-[rgba(20,20,20,0.6)] backdrop-blur-sm"
        style={{ animation: 'fade-in 0.25s ease' }}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
        className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-y-auto rounded-t-2xl bg-[var(--color-surface)] p-6 shadow-2xl sm:rounded-2xl sm:p-9"
        style={{ animation: 'tour-pop 0.3s cubic-bezier(0.22,1,0.36,1)' }}
      >
        <button
          onClick={onClose}
          aria-label={t.close[lang]}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-canvas)] hover:text-[var(--color-ink)]"
        >
          ✕
        </button>

        {state === 'sent' || state === 'mailed' ? (
          <div className="py-6 text-center">
            <SWMark className="text-4xl text-[var(--color-ink)]" line="h-[2px]" />
            <h2 id="contact-form-title" className="mt-6 font-display text-2xl font-normal">
              {t.formSentTitle[lang]}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {state === 'mailed' ? t.formMailFallback[lang] : t.formSentBody[lang]}
            </p>
            <button
              onClick={onClose}
              className="mt-6 min-h-11 rounded-full bg-[var(--color-ink)] px-6 text-sm font-semibold text-[var(--color-canvas)] transition-all active:scale-[0.98]"
            >
              {t.close[lang]}
            </button>
          </div>
        ) : (
          <>
            <h2 id="contact-form-title" className="font-display text-3xl font-normal">
              {t.formTitle[lang]}
            </h2>
            <span className="mt-3 block h-[1.5px] w-12 bg-[var(--color-accent)]" aria-hidden="true" />
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">{t.formBody[lang]}</p>

            <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
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
                <label htmlFor="contact-name" className={labelClass}>
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
                <label htmlFor="contact-email" className={labelClass}>
                  {t.formEmail[lang]}
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={initialMessage ? 4 : 3}
                  defaultValue={initialMessage}
                  placeholder={t.formMessageHint[lang]}
                  className={`resize-y ${fieldClass}`}
                />
                <label htmlFor="contact-message" className={labelClass}>
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
                className="mt-5 min-h-12 rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-on-accent)] transition-all hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'sending' ? t.formSending[lang] : state === 'failed' ? t.formRetry[lang] : t.formSend[lang]}
              </button>
            </form>

            <p className="mt-5 text-center font-mono text-xs text-[var(--color-ink-faint)]">
              {t.formOr[lang]}{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="accent-line text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
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

function Contact({ lang, onOpenForm }: { lang: Lang; onOpenForm: (message?: string) => void }) {
  const [copied, setCopied] = useState(false)
  const copyEmail = () => {
    navigator.clipboard?.writeText(CONTACT_EMAIL).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  // A pitch on the left, the brief slip on the right: the visitor can tell us
  // what they need in four taps before writing a single sentence.
  return (
    <section id="contact" className="relative pb-24 pt-16 sm:pb-32 sm:pt-24">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent-ink)]">
            {String(sectionNumbers.contact).padStart(2, '0')} — {t.sectionContact[lang]}
          </p>
          <h2 className="mt-5 max-w-xl font-display text-5xl font-light leading-[0.98] sm:text-7xl">
            {t.contactTitle[lang]}
          </h2>
          <motion.span
            className="mt-6 block h-[2px] w-24 origin-left bg-[var(--color-accent)]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            {lang === 'pl'
              ? 'Zaznacz na bilecie, czego potrzebujesz — z tym przyjdziemy na pierwszą rozmowę. Wolisz po swojemu? Napisz wprost.'
              : 'Tick on the slip what you need — we will bring it to the first call. Rather do it your way? Just write.'}
          </p>

          {/* Who answers: the three of us, not a sales inbox. */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {teamMembers.map((m) => (
                <img
                  key={m.name.en}
                  src={m.image}
                  alt={m.name[lang]}
                  loading="lazy"
                  className="h-11 w-11 rounded-full border-2 border-[var(--color-canvas)] object-cover grayscale"
                />
              ))}
            </div>
            <p className="text-sm leading-snug text-[var(--color-ink-soft)]">
              {lang === 'pl' ? 'Odpisuje ktoś z naszej trójki.' : 'One of the three of us replies.'}
              <span className="mt-0.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-positive)]" aria-hidden="true" />
                {t.replyPromise[lang]}
              </span>
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={`mailto:${CONTACT_EMAIL}`} className="accent-line font-display text-2xl text-[var(--color-ink)] sm:text-3xl">
              {CONTACT_EMAIL}
            </a>
            <button
              onClick={copyEmail}
              className="min-h-10 rounded-full border border-[var(--color-line-strong)] px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              {copied ? (lang === 'pl' ? 'Skopiowano ✓' : 'Copied ✓') : lang === 'pl' ? 'Kopiuj' : 'Copy'}
            </button>
          </div>
          <button
            onClick={() => onOpenForm()}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--color-ink)]"
          >
            <span className="accent-line">{lang === 'pl' ? 'Albo napisz wiadomość bez briefu' : 'Or write without the brief'}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <BriefTicket lang={lang} onSend={onOpenForm} />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Footer */

function Footer({ lang }: { lang: Lang }) {
  const links = [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Dribbble', href: 'https://dribbble.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
  ]

  // Closes the page the way the logo opens it: the mark, large and centred.
  return (
    <footer className="relative z-[2] mx-auto w-full max-w-6xl px-4 pb-28 pt-8 sm:px-8 lg:pb-12">
      <div className="flex flex-col items-center border-t border-[var(--color-line)] pt-16 text-center">
        <SWMark className="text-7xl text-[var(--color-ink)] sm:text-8xl" line="h-[2px]" />
        <p className="mt-8 max-w-sm font-display text-lg font-light italic text-[var(--color-ink-soft)]">
          {t.footerTagline[lang]}
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="accent-line mt-6 font-mono text-sm text-[var(--color-ink)]">
          {CONTACT_EMAIL}
        </a>
      </div>
      <div className="mt-14 flex flex-col items-center justify-between gap-4 font-mono text-[11px] text-[var(--color-ink-faint)] sm:flex-row">
        <span>
          © {new Date().getFullYear()} {t.brand[lang]}
        </span>
        <div className="flex gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="accent-line hover:text-[var(--color-ink)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
