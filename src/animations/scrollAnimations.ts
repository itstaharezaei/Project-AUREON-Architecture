import { ScrollTrigger } from './gsap'

let frame = 0

/** Coalesces refresh requests (language swap, image load, resize) into one pass. */
export const refreshScrollTriggers = (): void => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => ScrollTrigger.refresh())
  })
}

/** Content height changes (accordions, scrollbar locks, late images) stale trigger positions. */
export const observeLayoutRefresh = (): (() => void) => {
  let timer = 0
  const observer = new ResizeObserver(() => {
    clearTimeout(timer)
    timer = window.setTimeout(refreshScrollTriggers, 180)
  })
  observer.observe(document.body)
  return () => {
    clearTimeout(timer)
    observer.disconnect()
  }
}

export const scrollToSection = (selector: string, offset = 72): void => {
  const target = document.querySelector<HTMLElement>(selector)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}