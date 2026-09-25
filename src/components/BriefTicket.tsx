import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Lang, LS } from '../content'

// The contact block as a brief you fill in by tapping: an order slip, after
// the "order ticket" on sitekmikolaj.pl. Picking options writes the summary
// line as you go, stamps the slip once it is complete, and "Send" opens the
// contact form with the brief already written into the message. The app
// builder in section 04 can fill it in too, through a 'sw-brief' event.

type Option = { id: string; label: LS }
type Group = { id: 'type' | 'budget' | 'time'; label: LS; multi?: boolean; options: Option[] }

// ── Edit the ranges and wording here ─────────────────────────────────────
const GROUPS: Group[] = [
  {
    id: 'type',
    label: { pl: 'Czego potrzebujesz?', en: 'What do you need?' },
    multi: true,
    options: [
      { id: 'site', label: { pl: 'Strona', en: 'Website' } },
      { id: 'web', label: { pl: 'Aplikacja web', en: 'Web app' } },
      { id: 'mobile', label: { pl: 'Aplikacja mobilna', en: 'Mobile app' } },
      { id: 'shop', label: { pl: 'Sklep', en: 'Online shop' } },
      { id: 'unsure', label: { pl: 'Jeszcze nie wiem', en: 'Not sure yet' } },
    ],
  },
  {
    id: 'budget',
    label: { pl: 'Budżet', en: 'Budget' },
    options: [
      { id: 'b1', label: { pl: 'do 10 tys. zł', en: 'up to 10k PLN' } },
      { id: 'b2', label: { pl: '10–25 tys. zł', en: '10–25k PLN' } },
      { id: 'b3', label: { pl: '25–60 tys. zł', en: '25–60k PLN' } },
      { id: 'b4', label: { pl: '60 tys. zł +', en: '60k PLN +' } },
      { id: 'b0', label: { pl: 'Do ustalenia', en: 'To be agreed' } },
    ],
  },
  {
    id: 'time',
    label: { pl: 'Termin', en: 'Timeline' },
    options: [
      { id: 't1', label: { pl: 'Na wczoraj', en: 'ASAP' } },
      { id: 't2', label: { pl: '1–3 miesiące', en: '1–3 months' } },
      { id: 't3', label: { pl: 'Elastyczny', en: 'Flexible' } },
    ],
  },
]
// ─────────────────────────────────────────────────────────────────────────

const copy = {
  slip: { pl: 'Brief', en: 'Brief' },
  summary: { pl: 'Podsumowanie', en: 'Summary' },
  empty: { pl: 'Zaznacz, co pasuje — resztę dopytamy.', en: 'Tick what fits — we will ask about the rest.' },
  send: { pl: 'Wyślij brief', en: 'Send the brief' },
  stamp: { pl: 'Odpowiedź w 24 h', en: 'Reply in 24 h' },
  message: { pl: 'Brief ze strony', en: 'Brief from the site' },
}

export type Brief = Record<Group['id'], string[]>

export function briefSummary(brief: Brief, lang: Lang) {
  return GROUPS.flatMap((g) =>
    g.options.filter((o) => brief[g.id].includes(o.id)).map((o) => o.label[lang])
  ).join(' · ')
}

export default function BriefTicket({ lang, onSend }: { lang: Lang; onSend: (message: string) => void }) {
  const [brief, setBrief] = useState<Brief>({ type: [], budget: [], time: [] })
  const [features, setFeatures] = useState<string[]>([])

  useEffect(() => {
    const onBrief = (e: Event) => {
      const { type, features } = (e as CustomEvent<{ type: string; features: string[] }>).detail
      setBrief((b) => ({ ...b, type: b.type.includes(type) ? b.type : [...b.type, type] }))
      setFeatures(features)
    }
    window.addEventListener('sw-brief', onBrief)
    return () => window.removeEventListener('sw-brief', onBrief)
  }, [])

  const toggle = (group: Group, id: string) =>
    setBrief((b) => {
      const on = b[group.id].includes(id)
      const next = group.multi ? (on ? b[group.id].filter((x) => x !== id) : [...b[group.id], id]) : on ? [] : [id]
      return { ...b, [group.id]: next }
    })

  const summary = [briefSummary(brief, lang), features.join(', ')].filter(Boolean).join(' · ')
  const complete = GROUPS.every((g) => brief[g.id].length > 0)
  const today = new Date().toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const send = () => onSend(summary ? `${copy.message[lang]}: ${summary}\n\n` : '')

  return (
    <div className="relative mx-auto w-full max-w-[440px] rotate-[-1.2deg] transition-transform duration-500 [filter:drop-shadow(0_28px_28px_rgba(20,20,20,0.16))] hover:rotate-0">
      <div className="ticket relative bg-[var(--color-surface)] px-6 pb-9 pt-10 text-[var(--color-ink)] sm:px-8">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
          <span>SW Development</span>
          <span>{today}</span>
        </div>
        <div className="mt-3 flex items-end justify-between border-b border-dashed border-[var(--color-line-strong)] pb-4">
          <p className="font-display text-4xl leading-none">{copy.slip[lang]}</p>
        </div>

        {GROUPS.map((group) => (
          <fieldset key={group.id} className="border-b border-dashed border-[var(--color-line-strong)] py-4">
            <legend className="sr-only">{group.label[lang]}</legend>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]" aria-hidden="true">
              {group.label[lang]}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {group.options.map((o) => {
                const on = brief[group.id].includes(o.id)
                return (
                  <button
                    key={o.id}
                    type="button"
                    role={group.multi ? 'checkbox' : 'radio'}
                    aria-checked={on}
                    onClick={() => toggle(group, o.id)}
                    className={`min-h-9 rounded-full border px-3 text-[13px] transition-all active:scale-95 ${
                      on
                        ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-canvas)]'
                        : 'border-[var(--color-line-strong)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]'
                    }`}
                  >
                    {o.label[lang]}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}

        {features.length > 0 && (
          <div className="border-b border-dashed border-[var(--color-line-strong)] py-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
                {lang === 'pl' ? 'Funkcje z konfiguratora' : 'Features from the builder'}
              </p>
              <button
                type="button"
                onClick={() => setFeatures([])}
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
              >
                {lang === 'pl' ? 'Usuń' : 'Clear'} ×
              </button>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink)]">{features.join(' · ')}</p>
          </div>
        )}

        <div className="pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">{copy.summary[lang]}</p>
          <p className="mt-1.5 min-h-[2.75rem] font-display text-lg italic leading-snug" aria-live="polite">
            {summary || <span className="text-[var(--color-ink-faint)]">{copy.empty[lang]}</span>}
          </p>
        </div>

        <button
          type="button"
          onClick={send}
          className="group mt-4 flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-on-accent)] transition-all hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] active:scale-[0.98]"
        >
          {copy.send[lang]}
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </button>

        {/* Barcode foot, like a real slip */}
        <div className="mt-6 flex h-6 justify-center gap-[2px] opacity-40" aria-hidden="true">
          {[2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 4, 1, 1, 2, 3, 1, 2, 1].map((w, i) => (
            <span key={i} className="bg-[var(--color-ink)]" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Stamped once every group has an answer. */}
      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 1.8, rotate: -24 }}
            animate={{ opacity: 1, scale: 1, rotate: -14 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            className="pointer-events-none absolute right-4 top-16 flex h-28 w-28 flex-col items-center justify-center rounded-full border-[2.5px] border-[var(--color-accent)] text-center font-mono text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-[var(--color-accent)] mix-blend-multiply dark:mix-blend-screen sm:-right-6"
            aria-hidden="true"
          >
            <span className="font-display text-2xl normal-case tracking-[-0.04em]">SW</span>
            <span className="mx-3 mt-1 border-t border-[var(--color-accent)] pt-1">{copy.stamp[lang]}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
