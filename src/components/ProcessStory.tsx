import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { processSteps, sectionNumbers, type Lang } from '../content'

// The process told as one product being built. The section pins to the screen
// and scrolling moves a single mock-up through all five stages: sticky notes
// from the first call, grey wireframes, a design with the client's comments,
// a staged rollout, and finally the live app talking back.

const STAGES = processSteps.length

const copy = {
  eyebrow: { pl: 'Proces', en: 'Process' },
  title: { pl: 'Od karteczki do działającej aplikacji', en: 'From a sticky note to a working app' },
  sample: { pl: 'Przykładowy projekt · rezerwacje zajęć', en: 'Sample project · class bookings' },
  stage: { pl: 'Etap', en: 'Stage' },
  scroll: { pl: 'Przewijaj', en: 'Scroll' },
  notes: {
    pl: ['Rezerwacje online', 'Płatność z góry', 'Przypomnienia SMS', 'Musi działać na telefonie'],
    en: ['Online bookings', 'Pay up front', 'SMS reminders', 'Must work on phones'],
  },
  headline: { pl: 'Zarezerwuj zajęcia w 30 sekund', en: 'Book a class in 30 seconds' },
  book: { pl: 'Zarezerwuj', en: 'Book' },
  classes: {
    pl: [
      ['Pn 18:00', 'Joga'],
      ['Śr 19:30', 'Pilates'],
      ['Pt 07:00', 'Stretching'],
    ],
    en: [
      ['Mon 6pm', 'Yoga'],
      ['Wed 7:30pm', 'Pilates'],
      ['Fri 7am', 'Stretching'],
    ],
  },
  comment1: { pl: 'Większy przycisk?', en: 'Bigger button?' },
  comment2: { pl: 'Krótszy nagłówek ✓', en: 'Shorter headline ✓' },
  deploy: { pl: 'Wdrożenie', en: 'Rollout' },
  modules: {
    pl: ['Rezerwacje', 'Płatności', 'Panel admina'],
    en: ['Bookings', 'Payments', 'Admin panel'],
  },
  live: { pl: 'Na żywo', en: 'Live' },
  toast1: { pl: 'Nowa rezerwacja · Anna, Pn 18:00', en: 'New booking · Anna, Mon 6pm' },
  toast2: { pl: 'Dostępność 99,98% · 30 dni', en: 'Uptime 99.98% · 30 days' },
  chatQ: { pl: 'Dodajmy karnety?', en: 'Shall we add passes?' },
  chatA: { pl: 'Jasne — w następnym sprincie.', en: 'Sure — next sprint.' },
}

/** Grey wireframe block, or the real thing once the design exists. */
function Block({ wire, className = '', children }: { wire: boolean; className?: string; children?: ReactNode }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md transition-all duration-500 ${
        wire ? 'border border-dashed border-[var(--color-ink-faint)]/60 bg-[var(--color-line)]' : ''
      } ${className}`}
    >
      <div className={`h-full transition-opacity duration-500 ${wire ? 'opacity-0' : 'opacity-100'}`}>{children}</div>
    </div>
  )
}

function Mockup({ stage, lang }: { stage: number; lang: Lang }) {
  const wire = stage < 2
  const built = stage >= 1
  const notes = copy.notes[lang]

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-surface)] shadow-[0_40px_70px_-35px_rgba(20,20,20,0.5)]">
      <div className="flex h-8 items-center gap-1.5 border-b border-[var(--color-line)] px-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-[var(--color-line-strong)]" />
        ))}
        <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
          {lang === 'pl' ? 'twoja-aplikacja.pl' : 'your-app.com'}
        </span>
        <AnimatePresence>
          {stage === 4 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-positive)]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-positive)] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-positive)]" />
              </span>
              {copy.live[lang]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative aspect-[16/11] p-4 sm:p-6">
        {/* The app itself: invisible at the brief, grey at wireframes, real after. */}
        <motion.div
          className="flex h-full flex-col gap-3 sm:gap-4"
          animate={{ opacity: built ? 1 : 0, y: built ? 0 : 10 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <Block wire={wire} className="h-6 w-16">
              <span className="font-display text-lg leading-6 text-[var(--color-ink)]">kalmo</span>
            </Block>
            <div className="ml-auto flex gap-2">
              {[0, 1].map((i) => (
                <Block key={i} wire={wire} className="h-4 w-14">
                  <span className="block h-full font-mono text-[10px] leading-4 text-[var(--color-ink-soft)]">
                    {(lang === 'pl' ? ['Grafik', 'Karnety'] : ['Schedule', 'Passes'])[i]}
                  </span>
                </Block>
              ))}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-[1.2fr_1fr] gap-3 sm:gap-4">
            <div className="flex flex-col justify-center gap-2.5">
              <Block wire={wire} className="min-h-[2.6rem] sm:min-h-[4.5rem]">
                <p className="font-display text-base leading-tight text-[var(--color-ink)] sm:text-3xl">
                  {copy.headline[lang]}
                </p>
              </Block>
              <Block wire={wire} className="h-3 w-4/5">
                <span className="block h-full rounded bg-[var(--color-line)]" />
              </Block>
              <div className="relative mt-1 w-fit">
                <Block wire={wire} className={`h-8 transition-all duration-500 sm:h-10 ${stage >= 3 ? 'w-36 sm:w-44' : 'w-24 sm:w-28'}`}>
                  <span className="flex h-full items-center justify-center rounded-md bg-[var(--color-accent)] text-xs font-semibold text-[var(--color-on-accent)] sm:text-sm">
                    {copy.book[lang]} →
                  </span>
                </Block>
                <Pin show={stage === 2} who="K" text={copy.comment1[lang]} className="-top-10 left-0" />
              </div>
            </div>
            <Block wire={wire} className="h-full">
              <div className="relative h-full rounded-md bg-[var(--color-accent-soft)]">
                <span className="absolute left-[18%] top-[20%] h-[45%] w-[45%] rounded-full bg-[var(--color-accent)]/70" />
                <span className="absolute bottom-[14%] right-[14%] h-[34%] w-[34%] rounded-full border-2 border-[var(--color-ink)]/70" />
              </div>
            </Block>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {copy.classes[lang].map(([when, what], i) => (
              <Block key={i} wire={wire} className="h-12 sm:h-16">
                <div className="flex h-full flex-col justify-center rounded-md border border-[var(--color-line)] px-2 sm:px-3">
                  <span className="font-mono text-[9px] text-[var(--color-ink-faint)] sm:text-[10px]">{when}</span>
                  <span className="text-xs font-semibold text-[var(--color-ink)] sm:text-sm">{what}</span>
                </div>
              </Block>
            ))}
          </div>
        </motion.div>

        <Pin show={stage === 2} who="W" text={copy.comment2[lang]} className="left-[38%] top-[18%]" />

        {/* 01 — the brief, as the sticky notes from the first call. */}
        <AnimatePresence>
          {stage === 0 &&
            notes.map((note, i) => (
              <motion.div
                key={note}
                initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: [-6, 4, -3, 5][i] }}
                exit={{ opacity: 0, scale: 0.5, x: 60, transition: { duration: 0.3 } }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: i * 0.08 }}
                className="absolute w-[38%] rounded-sm bg-[#f6e7b8] p-3 font-display text-sm italic leading-snug text-[#141414] shadow-[0_12px_20px_-12px_rgba(20,20,20,0.5)] sm:p-4 sm:text-lg"
                style={{ left: ['6%', '52%', '12%', '55%'][i], top: ['8%', '12%', '52%', '56%'][i] }}
              >
                {note}
              </motion.div>
            ))}
        </AnimatePresence>

        {/* 04 — rollout, module by module. */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="absolute inset-x-4 bottom-4 rounded-lg bg-[#141414] p-3 font-mono text-[10px] text-[#f5f2ec] shadow-xl sm:inset-x-6 sm:bottom-6 sm:p-4 sm:text-[11px]"
            >
              <div className="flex items-center justify-between uppercase tracking-[0.14em] text-[#f5f2ec]/60">
                <span>{copy.deploy[lang]}</span>
                <span>v1.0</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-[var(--color-accent)]"
                  initial={{ width: '8%' }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {copy.modules[lang].map((m, i) => (
                  <span key={m} className={i < 2 ? 'text-[#5fbf86]' : 'text-[#f5f2ec]/50'}>
                    {i < 2 ? '✓' : '…'} {m}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 05 — live: the app reports back, and the conversation carries on. */}
        <AnimatePresence>
          {stage === 4 && (
            <motion.div className="absolute bottom-4 right-4 flex w-[62%] flex-col items-end gap-2 sm:bottom-6 sm:right-6 sm:w-[48%]">
              {[copy.toast1[lang], copy.toast2[lang]].map((toast, i) => (
                <motion.div
                  key={toast}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15 + i * 0.35 }}
                  className="w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-[10px] text-[var(--color-ink)] shadow-lg sm:text-xs"
                >
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-positive)]" />
                  {toast}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.9 }}
                className="flex w-full flex-col gap-1.5 rounded-lg bg-[#141414] p-2.5 text-[10px] sm:text-xs"
              >
                <span className="self-start rounded-md bg-white/10 px-2 py-1 text-[#f5f2ec]">{copy.chatQ[lang]}</span>
                <span className="self-end rounded-md bg-[var(--color-accent)] px-2 py-1 font-medium text-[var(--color-on-accent)]">
                  {copy.chatA[lang]}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** A comment pin, the way a design review looks in Figma. */
function Pin({ show, who, text, className }: { show: boolean; who: string; text: string; className: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.2 }}
          className={`absolute z-10 flex items-center gap-1.5 ${className}`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full rounded-bl-none bg-[var(--color-accent)] font-mono text-[10px] font-bold text-[var(--color-on-accent)]">
            {who}
          </span>
          <span className="whitespace-nowrap rounded-md bg-[#141414] px-2 py-1 text-[10px] text-[#f5f2ec] shadow-lg sm:text-xs">
            {text}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ProcessStory({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [stage, setStage] = useState(0)
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setStage(Math.min(STAGES - 1, Math.max(0, Math.floor(v * STAGES))))
  })

  // Jump to a stage: the scroll position that lands in the middle of its slice.
  const goTo = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + travel * ((i + 0.5) / STAGES), behavior: 'smooth' })
  }

  // From lg up the pinned panel keeps its natural height and is pinned so it
  // sits in the middle of the screen: centred while it scrolls, yet with no
  // empty screen-height above or below it when it lets go. Phones keep the
  // full-height centred panel.
  const pinRef = useRef<HTMLDivElement>(null)
  const [pinTop, setPinTop] = useState<number | undefined>(undefined)
  useEffect(() => {
    const el = pinRef.current
    if (!el) return
    const wide = window.matchMedia('(min-width: 1024px)')
    const place = () =>
      setPinTop(wide.matches ? Math.max(72, Math.round((window.innerHeight + 60 - el.offsetHeight) / 2)) : undefined)
    const ro = new ResizeObserver(place)
    ro.observe(el)
    window.addEventListener('resize', place)
    wide.addEventListener('change', place)
    place()
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', place)
      wide.removeEventListener('change', place)
    }
  }, [])

  const step = processSteps[stage]

  return (
    <section id="process" ref={ref} className="relative mt-4 sm:mt-6" style={{ height: `${STAGES * 90 + 100}vh` }}>
      <div
        ref={pinRef}
        className="sticky top-0 flex h-[100svh] flex-col justify-center pb-6 pt-16 lg:h-auto lg:py-6"
        style={pinTop !== undefined ? { top: pinTop } : undefined}
      >
        <div className="grid items-center gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent-ink)]">
              {String(sectionNumbers.process).padStart(2, '0')} — {copy.eyebrow[lang]}
            </p>
            <h2 className="mt-3 font-display text-2xl font-normal leading-[1.05] sm:text-5xl">{copy.title[lang]}</h2>

            {/* Desktop: the whole list, the current stage lit. */}
            <ol className="mt-10 hidden flex-col lg:flex">
              {processSteps.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => goTo(i)}
                    className="group flex w-full items-start gap-4 border-t border-[var(--color-line)] py-4 text-left"
                    aria-current={i === stage ? 'step' : undefined}
                  >
                    <span
                      className={`font-mono text-[11px] transition-colors ${
                        i === stage ? 'text-[var(--color-accent-ink)]' : 'text-[var(--color-ink-faint)]'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">
                      <span
                        className={`block font-display text-xl transition-colors ${
                          i === stage ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)] group-hover:text-[var(--color-ink-soft)]'
                        }`}
                      >
                        {s.title[lang]}
                      </span>
                      {/* A CSS grid-rows transition, not a framer height:'auto' one:
                          measuring 'auto' makes framer reset window.scrollY, which
                          cut short any smooth scroll passing through this section. */}
                      <span
                        className={`grid text-sm leading-relaxed text-[var(--color-ink-soft)] transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          i === stage ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                        aria-hidden={i !== stage}
                      >
                        <span className="block overflow-hidden">
                          <span className="block pt-1.5">{s.description[lang]}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            {/* Phones: only the current stage, to leave room for the mock-up. */}
            <div className="mt-4 lg:hidden" aria-live="polite">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                {copy.stage[lang]} {String(stage + 1).padStart(2, '0')} / {String(STAGES).padStart(2, '0')}
              </p>
              <p className="mt-1 font-display text-xl text-[var(--color-ink)]">{step.title[lang]}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-soft)]">{step.description[lang]}</p>
            </div>
          </div>

          <div>
            <Mockup stage={stage} lang={lang} />
            <div className="mt-4 flex items-center gap-4">
              <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-[var(--color-line)]">
                <motion.div className="h-full origin-left bg-[var(--color-accent)]" style={{ scaleX: bar }} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                {stage < STAGES - 1 ? `${copy.scroll[lang]} ↓` : copy.sample[lang]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
