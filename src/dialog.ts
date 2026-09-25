import { useEffect, useRef, type RefObject } from 'react'

// Shared behaviour for every modal on the page (case study, contact form,
// command palette, phone menu). While one is open it holds focus: focus moves
// in, Tab cycles inside it, the page behind does not scroll, and on close
// focus goes back to whatever opened it. Modals can stack (the palette can
// open over a case study), so only the top one answers the keyboard — Escape
// closes that one alone, and arrow keys typed in it never reach the one below.

const stack: symbol[] = []
let locks = 0

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** True while the modal owning this id is the top of the stack. */
export const isTopDialog = (id: symbol) => stack[stack.length - 1] === id

/**
 * Makes the element behind `ref` behave as a modal while `open` is true.
 * `initialFocus` picks what gets focus first (default: the first focusable
 * element). Returns a function telling whether this modal is on top, for
 * components with keys of their own.
 */
export function useDialog(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  { open = true, initialFocus }: { open?: boolean; initialFocus?: RefObject<HTMLElement | null> } = {}
) {
  const id = useRef(Symbol('dialog')).current
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    stack.push(id)
    if (locks++ === 0) document.body.style.overflow = 'hidden'

    // After the modal has rendered, move focus into it.
    const raf = requestAnimationFrame(() => {
      const target = initialFocus?.current ?? ref.current?.querySelector<HTMLElement>(FOCUSABLE) ?? ref.current
      target?.focus({ preventScroll: true })
    })

    const onKey = (e: KeyboardEvent) => {
      if (!isTopDialog(id)) return
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopImmediatePropagation()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const box = ref.current
      if (!box) return
      const items = [...box.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const inside = box.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault()
        first.focus()
      }
    }
    // Capture phase, so the top modal sees Escape before anything else does.
    window.addEventListener('keydown', onKey, true)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey, true)
      const at = stack.indexOf(id)
      if (at >= 0) stack.splice(at, 1)
      if (--locks === 0) document.body.style.overflow = ''
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true })
    }
  }, [open])

  return () => isTopDialog(id)
}

/** Whether a key event was typed into a field, where arrows move the caret. */
export const isTypingTarget = (e: KeyboardEvent) => {
  const el = e.target as HTMLElement | null
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
}
