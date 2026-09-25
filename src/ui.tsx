import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

/**
 * Smooth-scrolls a section to just under the header. The position comes from
 * offsetTop, which ignores transforms: sections still sliding in (Reveal)
 * would otherwise be measured mid-animation and land under the header.
 */
export const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  let top = 0
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  window.scrollTo({ top: top - margin, behavior: 'smooth' })
}

/** Only a precise pointer that is allowed to move things gets the pointer effects. */
export const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** The logo itself: "SW" in the display face over an accent line wider than the letters. */
export function SWMark({ className = '', line = 'h-[1.5px]' }: { className?: string; line?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`} aria-label="SW">
      <span className="font-display font-normal tracking-[-0.05em]">SW</span>
      <span className={`mt-[0.14em] w-[1.35em] bg-[var(--color-accent)] ${line}`} aria-hidden="true" />
    </span>
  )
}

/** Numbered like the logo: a display-face figure over a short accent line. */
export function SectionHeader({
  index,
  label,
  title,
  aside,
}: {
  index: number
  label: string
  title: ReactNode
  aside?: ReactNode
}) {
  return (
    <div className="mb-10 grid gap-6 sm:mb-14 lg:grid-cols-[auto_1fr_auto] lg:items-end lg:gap-10">
      <div className="flex items-start gap-5">
        <span className="flex flex-col items-start">
          <span className="font-display text-5xl font-light leading-none text-[var(--color-ink)] sm:text-6xl">
            {String(index).padStart(2, '0')}
          </span>
          <motion.span
            className="mt-2 h-[1.5px] w-10 origin-left bg-[var(--color-accent)]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />
        </span>
        <div className="pt-1">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent-ink)]">
            {label}
          </p>
          <h2 className="mt-2 font-display text-3xl font-normal leading-[1.05] sm:text-5xl">{title}</h2>
        </div>
      </div>
      <span
        className="mb-4 hidden h-px self-end bg-gradient-to-r from-[var(--color-line-strong)] to-transparent lg:block"
        aria-hidden="true"
      />
      {aside && <div className="max-w-sm text-sm leading-relaxed text-[var(--color-ink-soft)]">{aside}</div>}
    </div>
  )
}

/** A horizontal row the mouse can grab and drag sideways, anywhere on it,
    buttons included. A press that moves more than a few pixels becomes a drag
    and its click is swallowed; a still press still clicks. Touch and pens
    keep the browser's own swipe. */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let startX = 0
    let startScroll = 0
    let pressed = false
    let dragged = false
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      pressed = true
      dragged = false
      startX = e.clientX
      startScroll = el.scrollLeft
    }
    const move = (e: PointerEvent) => {
      if (!pressed) return
      const dx = e.clientX - startX
      if (!dragged && Math.abs(dx) > 5) {
        dragged = true
        el.style.cursor = 'grabbing'
        el.style.userSelect = 'none'
      }
      if (dragged) el.scrollLeft = startScroll - dx
    }
    const up = () => {
      pressed = false
      el.style.cursor = ''
      el.style.userSelect = ''
    }
    const click = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault()
        e.stopPropagation()
        dragged = false
      }
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    el.addEventListener('click', click, true)
    el.addEventListener('dragstart', (e) => e.preventDefault())
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      el.removeEventListener('click', click, true)
    }
  }, [])
  return ref
}
