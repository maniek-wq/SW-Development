import { useEffect, useRef } from 'react'
import type { Lang, TeamMember } from '../content'

// The team as ID badges hanging from one rail, after the lanyard badge on
// sitekmikolaj.pl: a spring on a string, gravity, damping, and a drag that
// throws the badge so it swings back on its own.

const WRAP_W = 280
const WRAP_H = 530
const ANCHOR_X = WRAP_W / 2
const REST = 96

/** A fixed pseudo-barcode per person, so it never reshuffles between renders. */
function barcode(seed: string) {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return Array.from({ length: 26 }, (_, i) => 1 + ((h >> (i % 24)) & 3))
}

function Badge({ member, index, lang }: { member: TeamMember; index: number; lang: Lang }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGLineElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const badge = badgeRef.current
    const line = lineRef.current
    if (!wrap || !badge || !line) return

    // Positioned by transform alone (the badge sits at 0,0): moving it never
    // triggers layout, only compositing.
    const place = (x: number, y: number, angle: number) => {
      badge.style.transform = `translate(${x}px, ${y}px) translate(-50%, 0) rotate(${angle}rad)`
      line.setAttribute('x2', String(x))
      line.setAttribute('y2', String(y))
    }

    // No physics for reduced motion: the badge simply hangs still.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      place(ANCHOR_X, REST, 0)
      return
    }

    const pos = { x: ANCHOR_X, y: REST }
    const vel = { x: 0, y: 0 }
    const k = 0.05
    const friction = 0.92
    const gravity = 0.8
    const grab = { x: 0, y: 0 }
    let dragging = false
    let visible = false
    let raf = 0

    const onDown = (e: PointerEvent) => {
      dragging = true
      const r = wrap.getBoundingClientRect()
      grab.x = e.clientX - r.left - pos.x
      grab.y = e.clientY - r.top - pos.y
      badge.style.cursor = 'grabbing'
      try {
        badge.setPointerCapture(e.pointerId)
      } catch {}
      wake()
    }
    const last = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      e.preventDefault()
      const r = wrap.getBoundingClientRect()
      // Keep the badge on screen horizontally, so a drag never opens a
      // sideways scroll on phones.
      const half = badge.offsetWidth / 2
      const nx = Math.min(window.innerWidth - half - 4 - r.left, Math.max(half + 4 - r.left, e.clientX - r.left - grab.x))
      const ny = Math.max(20, Math.min(e.clientY - r.top - grab.y, WRAP_H - 60))
      // Remember the throw so letting go keeps the momentum.
      last.x = nx - pos.x
      last.y = ny - pos.y
      pos.x = nx
      pos.y = ny
    }
    const onUp = () => {
      if (!dragging) return
      dragging = false
      badge.style.cursor = 'grab'
      vel.x = last.x * 0.6
      vel.y = last.y * 0.6
      wake()
    }

    badge.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    // Only simulate while on screen; entering the viewport gives each badge a
    // small push, so the three swing in slightly out of step.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) vel.x += (index - 1 || 0.6) * 5
      visible = entry.isIntersecting
      wake()
    })
    io.observe(wrap)

    // The loop only runs while there is something to animate: it stops once
    // the badge has settled (or left the screen) and wakes on a push or drag.
    const wake = () => {
      if (!raf && (visible || dragging)) raf = requestAnimationFrame(tick)
    }
    const tick = () => {
      raf = 0
      if (visible && !dragging) {
        const dx = pos.x - ANCHOR_X
        const dy = pos.y
        const dist = Math.hypot(dx, dy) || 1
        const force = (dist - REST) * k
        vel.x = (vel.x - (dx / dist) * force) * friction
        vel.y = (vel.y - (dy / dist) * force + gravity) * friction
        pos.x += vel.x
        pos.y += vel.y
      }
      if (visible || dragging) {
        const angle = Math.atan2(pos.y, pos.x - ANCHOR_X) - Math.PI / 2
        place(pos.x, pos.y, angle + (dragging ? 0 : vel.x * 0.04))
      }
      const settled = !dragging && Math.abs(vel.x) < 0.01 && Math.abs(vel.y) < 0.01
      if (dragging || (visible && !settled)) raf = requestAnimationFrame(tick)
    }
    place(pos.x, pos.y, 0)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      badge.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [index])

  const bars = barcode(member.name.en)
  const id = `SW-${String(index + 1).padStart(2, '0')}`

  return (
    <div ref={wrapRef} className="relative mx-auto h-[530px] w-[280px]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <line
          ref={lineRef}
          x1={ANCHOR_X}
          y1="0"
          x2={ANCHOR_X}
          y2={REST}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <circle cx={ANCHOR_X} cy="0" r="4" fill="var(--color-ink)" />
      </svg>

      <div
        ref={badgeRef}
        className="group absolute w-[228px] cursor-grab select-none rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-surface)] p-4 shadow-[0_30px_50px_-28px_rgba(20,20,20,0.5)]"
        style={{
          left: 0,
          top: 0,
          transform: `translate(${ANCHOR_X}px, ${REST}px) translate(-50%, 0)`,
          transformOrigin: '50% 0%',
          touchAction: 'none',
        }}
      >
        {/* The punched slot the lanyard clips into */}
        <div className="mx-auto mb-3 h-2 w-10 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-canvas)]" />

        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
          <span className="flex items-center gap-1.5">
            <span className="font-display text-[13px] normal-case tracking-[-0.04em] text-[var(--color-ink)]">SW</span>
            Development
          </span>
          <span>{id}</span>
        </div>

        <div className="relative mt-2.5 h-[150px] overflow-hidden rounded-lg bg-[var(--color-line)]">
          <img
            src={member.image}
            alt={member.name[lang]}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        </div>

        <span className="mt-3 inline-block rounded-sm bg-[var(--color-accent)] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-accent)]">
          {lang === 'pl' ? 'Pełny dostęp' : 'All access'}
        </span>
        <p className="mt-2 font-display text-xl leading-tight text-[var(--color-ink)]">{member.name[lang]}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
          {member.role[lang]}
        </p>

        <div className="mt-3 flex h-5 items-stretch justify-center gap-[2px] opacity-50" aria-hidden="true">
          {bars.map((w, i) => (
            <span key={i} className="bg-[var(--color-ink)]" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HangingBadges({ members, lang }: { members: TeamMember[]; lang: Lang }) {
  return (
    <div className="relative">
      {/* The rail all three lanyards hang from */}
      <div className="absolute inset-x-0 top-0 hidden h-[3px] rounded-full bg-[var(--color-ink)] md:block" aria-hidden="true" />
      <div className="grid gap-y-12 md:grid-cols-3">
        {members.map((member, i) => (
          <div key={member.name.en} className="relative flex flex-col">
            {/* Stacked on phones, each badge gets its own stretch of rail. */}
            <div className="absolute inset-x-12 top-0 h-[3px] rounded-full bg-[var(--color-ink)] md:hidden" aria-hidden="true" />
            <Badge member={member} index={i} lang={lang} />
            <div className="mx-auto max-w-[300px] px-2 text-center md:text-left">
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">{member.bio[lang]}</p>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-[var(--color-ink-faint)]">
                {member.education[lang]}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
        {lang === 'pl' ? '↕ Złap identyfikator i pociągnij' : '↕ Grab a badge and pull'}
      </p>
    </div>
  )
}
