import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Lang, LS, Project } from '../content'
import { scrollToSection } from '../ui'
import { closestProject, featureLabel, readIdea } from './AppBuilder'

// The hero's "describe your app" box. Until the visitor types, example ideas
// type themselves out; either way the features we read from the text light up
// underneath, with the closest project we have built. Submitting hands the
// idea to the builder in section 04 through a 'sw-builder' event.

// ── Edit the example ideas here ───────────────────────────────────────────
const EXAMPLES: LS[] = [
  {
    pl: 'Aplikacja na telefon do rezerwacji wizyt w salonie, z płatnością i przypomnieniem',
    en: 'A phone app for booking salon visits, with payment and a reminder',
  },
  {
    pl: 'Sklep internetowy z panelem admina, po polsku i angielsku',
    en: 'An online shop with an admin panel, in Polish and English',
  },
  {
    pl: 'Aplikacja dla ekipy w terenie: mapa, czat i raporty PDF',
    en: 'An app for a field crew: map, chat and PDF reports',
  },
  {
    pl: 'Skaner zdjęć z AI dla klientów z kontem i abonamentem',
    en: 'An AI photo scanner for customers with an account and a subscription',
  },
]
// ──────────────────────────────────────────────────────────────────────────

/** The longest example per language; it sizes the field. */
const longest: LS = {
  pl: EXAMPLES.reduce((a, e) => (e.pl.length > a.length ? e.pl : a), ''),
  en: EXAMPLES.reduce((a, e) => (e.en.length > a.length ? e.en : a), ''),
}

const copy = {
  label: { pl: 'Opisz swój pomysł', en: 'Describe your idea' },
  example: { pl: 'przykład', en: 'example' },
  submit: { pl: 'Złóż to', en: 'Build it' },
  read: { pl: 'Widzimy tu', en: 'We read' },
  none: { pl: 'Napisz, co ma robić — resztę rozpiszemy razem', en: 'Say what it should do — we will work out the rest together' },
  closest: { pl: 'Podobne do', en: 'Similar to' },
  mobile: { pl: 'Telefon', en: 'Phone' },
  web: { pl: 'Przeglądarka', en: 'Browser' },
}

/** Types the examples out one after another, then deletes them again. */
function useTypedExample(lang: Lang, paused: boolean) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const full = EXAMPLES[i % EXAMPLES.length][lang]

  useEffect(() => {
    if (paused || reduce) return
    const id = window.setTimeout(
      () => {
        if (!deleting && n < full.length) setN(n + 1)
        else if (!deleting) setDeleting(true)
        else if (n > 0) setN(Math.max(0, n - 3))
        else {
          setDeleting(false)
          setI(i + 1)
        }
      },
      !deleting && n === full.length ? 2600 : deleting ? 18 : 38
    )
    return () => window.clearTimeout(id)
  }, [n, deleting, full, i, paused, reduce])

  return { typed: reduce ? full : full.slice(0, n), full }
}

export default function IdeaPrompt({ lang, onOpen }: { lang: Lang; onOpen: (p: Project) => void }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  // The example only types itself while the box is on screen.
  const boxRef = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(true)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const { typed, full } = useTypedExample(lang, focused || value.length > 0 || !onScreen)
  const demo = value.trim().length === 0

  const text = demo ? typed : value
  const idea = readIdea(text)
  const closest = closestProject(idea.features)

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const read = readIdea(demo ? full : value)
    window.dispatchEvent(new CustomEvent('sw-builder', { detail: read }))
    scrollToSection('stack')
  }

  return (
    <div ref={boxRef} className="max-w-2xl">
      <form
        onSubmit={submit}
        className={`relative rounded-[28px] border bg-[var(--color-surface)] p-2 shadow-[0_30px_60px_-36px_rgba(20,20,20,0.45)] transition-colors ${
          focused ? 'border-[var(--color-ink)]' : 'border-[var(--color-line-strong)]'
        }`}
      >
        {/* Fixed height, one line: the badges coming and going must not move anything. */}
        <div className="mt-3 flex h-6 items-center justify-between gap-2 px-4">
          <label
            htmlFor="idea"
            className="min-w-0 truncate whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]"
          >
            {copy.label[lang]}
            {demo && !focused && (
              <span className="ml-2 rounded bg-[var(--color-canvas)] px-1.5 py-0.5 text-[var(--color-ink-faint)]" aria-hidden="true">
                {copy.example[lang]}
              </span>
            )}
          </label>
          <AnimatePresence>
            {idea.platform && (
              <motion.span
                key={idea.platform}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="shrink-0 whitespace-nowrap rounded-full border border-[var(--color-line-strong)] px-2 py-0.5 font-mono text-[10px] leading-4 text-[var(--color-ink-soft)]"
              >
                {copy[idea.platform][lang]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* The field's height is set by invisible copies stacked in one grid
            cell: the longest example and whatever has been typed. It never
            changes as the examples cycle, so nothing below it jumps; it only
            grows once the visitor writes more than the longest example. */}
        <div className="relative mx-4 mb-2 mt-1.5 font-display text-xl leading-snug sm:text-2xl">
          <div className="invisible grid min-h-[2lh] whitespace-pre-wrap break-words" aria-hidden="true">
            <p className="[grid-area:1/1]">{longest[lang] + ' '}</p>
            <p className="[grid-area:1/1]">{value + ' '}</p>
          </div>
          <textarea
            id="idea"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) submit(e)
            }}
            className="absolute inset-0 z-10 h-full w-full resize-none overflow-hidden bg-transparent text-[var(--color-ink)] outline-none"
            aria-describedby="idea-read"
          />
          {/* The typed example sits under the empty field, caret and all. */}
          {demo && (
            <p className="pointer-events-none absolute inset-0 text-[var(--color-ink-faint)]" aria-hidden="true">
              {focused ? '' : typed}
              {/* Zero width, drawn by its shadow: the caret can never wrap onto a new line. */}
              <span className="ml-0.5 inline-block h-[1.1em] w-0 translate-y-[0.2em] animate-pulse shadow-[0_0_0_1px_var(--color-accent)]" />
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-[var(--color-line)] px-2 pt-2 sm:flex-row sm:items-end sm:gap-3">
          {/* One row, always: chips that do not fit scroll sideways instead of
              wrapping onto a second line and pushing the page down. */}
          <div
            id="idea-read"
            className="flex h-10 min-w-0 shrink-0 flex-nowrap sm:flex-1 items-center gap-1.5 overflow-x-auto px-2 pb-1 [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)] [scrollbar-width:none]"
            aria-live={demo ? 'off' : 'polite'}
          >
            <span className="mr-1 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
              {copy.read[lang]}
            </span>
            <AnimatePresence initial={false} mode="popLayout">
              {idea.features.map((id) => (
                <motion.span
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.7, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 460, damping: 28 }}
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[12px] font-medium text-[var(--color-accent-ink)]"
                >
                  <span aria-hidden="true">✓</span> {featureLabel(id)[lang]}
                </motion.span>
              ))}
            </AnimatePresence>
            {idea.features.length === 0 && (
              <span className="truncate text-[12px] text-[var(--color-ink-faint)]">{copy.none[lang]}</span>
            )}
          </div>
          <button
            type="submit"
            className="group mb-1 inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-on-accent)] transition-all hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] active:scale-[0.97] sm:px-6"
          >
            {copy.submit[lang]}
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </form>

      {/* The closest thing we have already shipped, one click away */}
      <div className="mt-3 h-9 px-4">
        <AnimatePresence mode="wait">
          {closest && (
            <motion.button
              key={closest.p.id}
              type="button"
              onClick={() => onOpen(closest.p)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="group flex items-center gap-2.5 text-left text-[13px] text-[var(--color-ink-soft)]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                → {copy.closest[lang]}
              </span>
              <span className="h-7 w-11 shrink-0 overflow-hidden rounded border border-[var(--color-line)] bg-[var(--color-canvas)]">
                {closest.p.status !== 'private' && closest.p.image && (
                  <img src={closest.p.image} alt="" className="h-full w-full object-cover object-top" />
                )}
              </span>
              <span className="accent-line font-medium text-[var(--color-ink)]">{closest.p.name[lang].split(' — ')[0]}</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
