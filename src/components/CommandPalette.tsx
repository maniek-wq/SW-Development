import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { categories, faq, projects, sectionKeys, sectionNumbers, type Lang, type LS, type Project, type SectionKey } from '../content'
import { scrollToSection } from '../ui'
import { useDialog } from '../dialog'

// Ctrl/⌘ + K (or the search button in the header) opens a search over the
// whole site: sections, every project (straight into its case study), the FAQ
// answers and a few actions. The list sits on the left, and the right pane
// previews whatever is selected, so you can look before you jump.

export type PaletteActions = {
  openForm: () => void
  openProject: (p: Project) => void
  toggleTheme: () => void
  toggleLang: () => void
  email: string
}

type Group = 'sections' | 'actions' | 'projects' | 'faq'

type Item = {
  id: string
  group: Group
  label: string
  /** Extra text the search also looks through */
  keywords: string
  /** Short text on the right of the row */
  meta?: string
  icon: ReactNode
  preview: ReactNode
  run: () => void
  /** Keeps the palette open after running (copy shows its tick in place) */
  stay?: boolean
}

const groupLabel: Record<Group, LS> = {
  sections: { pl: 'Sekcje', en: 'Sections' },
  actions: { pl: 'Akcje', en: 'Actions' },
  projects: { pl: 'Realizacje', en: 'Work' },
  faq: { pl: 'Pytania', en: 'Questions' },
}

const sectionText: Record<SectionKey, { label: LS; about: LS }> = {
  work: {
    label: { pl: 'Realizacje', en: 'Work' },
    about: {
      pl: `${projects.length} projektów: systemy dla firm, aplikacje mobilne, sklepy i strony.`,
      en: `${projects.length} projects: business systems, mobile apps, shops and sites.`,
    },
  },
  about: {
    label: { pl: 'Zespół', en: 'Team' },
    about: { pl: 'Kto nad czym pracuje i z kim rozmawiasz przez cały projekt.', en: 'Who works on what, and who you talk to throughout.' },
  },
  process: {
    label: { pl: 'Proces', en: 'Process' },
    about: { pl: 'Od pierwszej rozmowy do wdrożenia — krok po kroku.', en: 'From the first call to launch, step by step.' },
  },
  stack: {
    label: { pl: 'Konfigurator', en: 'Builder' },
    about: { pl: 'Złóż swoją aplikację z gotowych modułów i zobacz ją na podglądzie.', en: 'Put your app together from modules and see it previewed.' },
  },
  testimonials: {
    label: { pl: 'Opinie', en: 'Reviews' },
    about: { pl: 'Listy referencyjne od firm, dla których budowaliśmy.', en: 'Reference letters from businesses we built for.' },
  },
  faq: {
    label: { pl: 'FAQ', en: 'FAQ' },
    about: { pl: 'Najczęstsze pytania przed rozpoczęciem współpracy.', en: 'The questions people ask before we start.' },
  },
  contact: {
    label: { pl: 'Kontakt', en: 'Contact' },
    about: { pl: 'Brief projektu i bezpośredni kontakt do zespołu.', en: 'The project brief and a direct line to the team.' },
  },
}

/** Lower-case, without Polish diacritics, one character per character, so
 *  match positions in the folded text are positions in the original too. */
const fold = (s: string) =>
  Array.from(s.toLowerCase(), (c) => (c === 'ł' ? 'l' : c.normalize('NFD')[0])).join('')

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
export const paletteShortcut = isMac ? '⌘ K' : 'Ctrl K'

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d={d} />
  </svg>
)
const icons = {
  write: 'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4',
  copy: 'M9 9h10v11H9zM5 15V4h10',
  theme: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  lang: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z',
  faq: 'M9.2 9a3 3 0 0 1 5.6 1c0 2-2.8 2.4-2.8 4M12 17.5v.01',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
}

/** The part of the label that matches the query, in the accent colour. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = fold(query.trim())
  const at = q ? fold(text).indexOf(q) : -1
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-sm bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]">{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  )
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-[var(--color-line-strong)] bg-[var(--color-ink)]/[0.04] px-1.5 font-mono text-[10px] text-[var(--color-ink-soft)]">
      {children}
    </kbd>
  )
}

export default function CommandPalette({ lang, actions }: { lang: Lang; actions: PaletteActions }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const items: Item[] = useMemo(() => {
    const sections: Item[] = sectionKeys.map((k) => {
      const n = String(sectionNumbers[k]).padStart(2, '0')
      const s = sectionText[k]
      return {
        id: `s-${k}`,
        group: 'sections',
        label: s.label[lang],
        keywords: `${s.about[lang]} ${k}`,
        meta: `#${k}`,
        icon: <span className="font-mono text-[10px] font-medium">{n}</span>,
        preview: (
          <>
            <span className="font-display text-7xl font-light leading-none text-[var(--color-ink)]">{n}</span>
            <span className="mt-3 block h-[1.5px] w-10 bg-[var(--color-accent)]" />
            <p className="mt-5 font-display text-2xl text-[var(--color-ink)]">{s.label[lang]}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{s.about[lang]}</p>
          </>
        ),
        run: () => scrollToSection(k),
      }
    })

    const actionPreview = (icon: string, title: string, body: string) => (
      <>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)] [&_svg]:h-6 [&_svg]:w-6">
          <Icon d={icon} />
        </span>
        <p className="mt-5 font-display text-2xl text-[var(--color-ink)]">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{body}</p>
      </>
    )
    const acts: Item[] = [
      {
        id: 'a-write',
        group: 'actions',
        label: lang === 'pl' ? 'Napisz do nas' : 'Write to us',
        keywords: 'kontakt contact formularz form wiadomość message brief',
        icon: <Icon d={icons.write} />,
        preview: actionPreview(
          icons.write,
          lang === 'pl' ? 'Napisz do nas' : 'Write to us',
          lang === 'pl' ? 'Krótki formularz: kilka zdań o pomyśle wystarczy, resztę dopytamy.' : 'A short form: a few sentences about the idea is enough, we will ask about the rest.'
        ),
        run: actions.openForm,
      },
      {
        id: 'a-copy',
        group: 'actions',
        label: copied ? (lang === 'pl' ? 'Skopiowano ✓' : 'Copied ✓') : lang === 'pl' ? 'Kopiuj adres e-mail' : 'Copy email address',
        keywords: `email mail adres ${actions.email}`,
        meta: actions.email,
        icon: <Icon d={icons.copy} />,
        preview: actionPreview(icons.copy, actions.email, lang === 'pl' ? 'Adres trafi do schowka — wklej go w swojej poczcie.' : 'The address goes to your clipboard, ready to paste.'),
        run: () => {
          navigator.clipboard?.writeText(actions.email).catch(() => {})
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        },
        stay: true,
      },
      {
        id: 'a-theme',
        group: 'actions',
        label: lang === 'pl' ? 'Przełącz motyw jasny / ciemny' : 'Toggle light / dark',
        keywords: 'theme motyw dark light ciemny jasny tryb',
        icon: <Icon d={icons.theme} />,
        preview: actionPreview(icons.theme, lang === 'pl' ? 'Jasny czy ciemny' : 'Light or dark', lang === 'pl' ? 'Zapamiętamy wybór na tym urządzeniu.' : 'Your choice is remembered on this device.'),
        run: actions.toggleTheme,
      },
      {
        id: 'a-lang',
        group: 'actions',
        label: lang === 'pl' ? 'English version' : 'Wersja polska',
        keywords: 'language język english polski pl en',
        meta: 'PL / EN',
        icon: <Icon d={icons.lang} />,
        preview: actionPreview(icons.lang, lang === 'pl' ? 'English version' : 'Wersja polska', lang === 'pl' ? 'Cała strona po angielsku.' : 'The whole site in Polish.'),
        run: actions.toggleLang,
      },
    ]

    const work: Item[] = projects.map((p) => {
      const cat = categories.find((c) => c.key === p.category)?.label[lang] ?? ''
      return {
        id: `p-${p.id}`,
        group: 'projects',
        label: p.name[lang],
        keywords: `${p.tagline[lang]} ${p.stack.join(' ')} ${cat} ${p.year}`,
        meta: `${cat} · ${p.year}`,
        icon: p.image ? (
          <img src={p.image} alt="" className="h-full w-full object-cover object-top" />
        ) : (
          <Icon d={icons.lock} />
        ),
        preview: (
          <>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-ink)]/[0.04]">
              {p.image ? (
                <img src={p.image} alt="" className="h-full w-full object-cover object-top" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--color-ink-faint)]">
                  <Icon d={icons.lock} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{lang === 'pl' ? 'Projekt prywatny' : 'Private project'}</span>
                </div>
              )}
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent-ink)]">
              {cat} · {p.year}
            </p>
            <p className="mt-1.5 font-display text-xl leading-tight text-[var(--color-ink)]">{p.name[lang]}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{p.tagline[lang]}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.slice(0, 4).map((s) => (
                <span key={s} className="rounded-full border border-[var(--color-line)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-ink-soft)]">
                  {s}
                </span>
              ))}
            </div>
          </>
        ),
        run: () => actions.openProject(p),
      }
    })

    const questions: Item[] = faq.map((f, i) => ({
      id: `f-${i}`,
      group: 'faq',
      label: f.q[lang],
      keywords: f.a[lang],
      icon: <Icon d={icons.faq} />,
      preview: (
        <>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)] [&_svg]:h-6 [&_svg]:w-6">
            <Icon d={icons.faq} />
          </span>
          <p className="mt-5 font-display text-xl leading-snug text-[var(--color-ink)]">{f.q[lang]}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{f.a[lang]}</p>
        </>
      ),
      run: () => {
        // Opens this very question in the FAQ
        window.dispatchEvent(new CustomEvent('sw-faq', { detail: i }))
        scrollToSection('faq')
      },
    }))

    return [...sections, ...acts, ...work, ...questions]
  }, [lang, actions, copied])

  // With nothing typed: sections, actions and the work. The FAQ joins in once
  // there is a query, since its answers are what people search for.
  const q = fold(query.trim())
  const filtered = q
    ? items.filter((it) => fold(it.label).includes(q) || fold(it.keywords).includes(q))
    : items.filter((it) => it.group !== 'faq')
  const current = filtered[Math.min(selected, filtered.length - 1)]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('sw-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('sw-palette', onOpen)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setSelected(0)
  }, [open])

  // Keep the selected row in view while moving with the arrows (not the
  // mouse: a half-visible row under the pointer would scroll away from it).
  const byKey = useRef(false)
  useEffect(() => {
    if (!byKey.current) return
    byKey.current = false
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [selected, query])

  // Focus goes to the search box, except on phones, where it would pop the
  // system keyboard over the list; there the dialog itself takes focus.
  const boxRef = useRef<HTMLDivElement>(null)
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  useDialog(boxRef, () => setOpen(false), { open, initialFocus: fine ? inputRef : boxRef })

  const run = (it: Item | undefined) => {
    if (!it) return
    it.run()
    if (!it.stay) setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      byKey.current = true
      setSelected((s) => Math.min(filtered.length - 1, s + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      byKey.current = true
      setSelected((s) => Math.max(0, s - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(current)
    }
  }

  const enterHint: Record<Group, LS> = {
    sections: { pl: 'przejdź', en: 'go' },
    actions: { pl: 'wykonaj', en: 'run' },
    projects: { pl: 'otwórz case study', en: 'open case study' },
    faq: { pl: 'pokaż w FAQ', en: 'show in FAQ' },
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center px-3 pt-[10vh] sm:px-4" onKeyDown={onKeyDown}>
          <motion.div
            className="absolute inset-0 bg-[var(--color-canvas)]/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={boxRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'pl' ? 'Szukaj na stronie' : 'Search the site'}
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="relative flex h-[min(560px,78vh)] w-full max-w-[820px] flex-col overflow-hidden rounded-3xl border border-[var(--color-line-strong)] bg-[var(--color-canvas)]/90 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)] outline-none backdrop-blur-2xl"
          >
            {/* A thin glow along the top edge, in the accent */}
            <span
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-80"
              aria-hidden="true"
            />

            <div className="flex items-center gap-3 border-b border-[var(--color-line)] px-5">
              <span className="text-[var(--color-accent-ink)] [&_svg]:h-5 [&_svg]:w-5">
                <Icon d={icons.search} />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelected(0)
                  listRef.current?.scrollTo({ top: 0 })
                }}
                placeholder={lang === 'pl' ? 'Szukaj sekcji, projektów, pytań…' : 'Search sections, projects, questions…'}
                className="h-16 min-w-0 flex-1 bg-transparent font-display text-lg text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)] focus-visible:outline-none sm:text-xl"
                aria-label={lang === 'pl' ? 'Szukaj na stronie' : 'Search the site'}
                // Inline: the global :focus-visible ring is unlayered and would win over a utility.
                style={{ outline: 'none' }}
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded-md font-mono text-[10px] text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-ink)]"
                aria-label={lang === 'pl' ? 'Zamknij' : 'Close'}
              >
                <Kbd>Esc</Kbd>
              </button>
            </div>

            <div className="flex min-h-0 flex-1">
              <div ref={listRef} className="min-w-0 flex-1 overflow-y-auto overscroll-contain p-2 md:basis-[56%]" role="listbox">
                {filtered.map((it, i) => (
                  <div key={it.id}>
                    {(i === 0 || filtered[i - 1].group !== it.group) && (
                      <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
                        {groupLabel[it.group][lang]}
                      </p>
                    )}
                    <button
                      role="option"
                      aria-selected={it === current}
                      onClick={() => run(it)}
                      onMouseMove={() => setSelected(i)}
                      className={`relative flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors ${
                        it === current ? 'bg-[var(--color-accent-soft)]' : ''
                      }`}
                    >
                      {it === current && (
                        <motion.span
                          layoutId="palette-bar"
                          className="absolute inset-y-3 left-0 w-[2px] rounded-full bg-[var(--color-accent)]"
                          transition={{ type: 'spring', stiffness: 600, damping: 40 }}
                        />
                      )}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border transition-colors ${
                          it === current
                            ? 'border-[var(--color-accent)]/40 text-[var(--color-accent-ink)]'
                            : 'border-[var(--color-line)] text-[var(--color-ink-soft)]'
                        }`}
                      >
                        {it.icon}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-ink)]">
                        <Highlight text={it.label} query={query} />
                      </span>
                      {it.meta && (
                        <span className="hidden shrink-0 truncate font-mono text-[10px] text-[var(--color-ink-faint)] sm:block md:max-w-[9rem]">{it.meta}</span>
                      )}
                    </button>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                    <p className="font-display text-lg text-[var(--color-ink)]">{lang === 'pl' ? 'Nic takiego tu nie ma.' : 'Nothing like that here.'}</p>
                    <p className="text-sm text-[var(--color-ink-soft)]">
                      {lang === 'pl' ? 'Spróbuj „sklep”, „mobile” albo „cena”.' : 'Try “shop”, “mobile” or “price”.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Preview of the selected row; wide screens only */}
              <div className="hidden min-w-0 basis-[44%] border-l border-[var(--color-line)] bg-[var(--color-ink)]/[0.02] md:block">
                <AnimatePresence mode="wait">
                  {current && (
                    <motion.div
                      key={current.id + lang}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      className="h-full overflow-y-auto p-6"
                    >
                      {current.preview}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-[var(--color-line)] px-5 py-3 text-[11px] text-[var(--color-ink-faint)]">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                {lang === 'pl' ? 'wybierz' : 'move'}
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>↵</Kbd>
                {current ? enterHint[current.group][lang] : lang === 'pl' ? 'otwórz' : 'open'}
              </span>
              <span className="ml-auto hidden items-center gap-1.5 sm:flex">
                {lang === 'pl' ? 'otwórz z każdego miejsca' : 'open from anywhere'}
                <Kbd>{paletteShortcut}</Kbd>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
