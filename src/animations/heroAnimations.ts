import { gsap } from './gsap'

const q = (root: HTMLElement, selector: string) => root.querySelectorAll(selector)

/** Cinematic entry: media opens from a small window, type rises line by line. */
export const heroIntro = (root: HTMLElement): gsap.core.Timeline => {
  const media = root.querySelector('[data-hero-media]')
  const image = root.querySelector('[data-hero-image]')
  const lines = q(root, '[data-hero-line]')
  const fades = q(root, '[data-hero-fade]')
  const decor = q(root, '[data-hero-decor]')

  gsap.set(media, { clipPath: 'inset(30% 20% 30% 20%)' })
  gsap.set(image, { scale: 1.3 })
  gsap.set(lines, { yPercent: 115 })
  gsap.set(fades, { autoAlpha: 0, y: 26 })
  gsap.set(decor, { autoAlpha: 0 })

  return gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power3.inOut' }, 0.15)
    .to(image, { scale: 1.12, duration: 1.8, ease: 'power3.inOut' }, 0.15)
    .to(lines, { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.6)
    .to(fades, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 1.05)
    .to(decor, { autoAlpha: 1, duration: 1.1, stagger: 0.09 }, 1.25)
}

/** Depth on scroll: image drifts down, type lifts away at a different rate. */
export const heroScroll = (root: HTMLElement): void => {
  const image = root.querySelector('[data-hero-image]')
  const content = root.querySelector('[data-hero-content]')
  const trigger = { trigger: root, start: 'top top', end: 'bottom top', scrub: true }

  gsap.to(image, { yPercent: 14, ease: 'none', scrollTrigger: trigger })
  gsap.to(content, { yPercent: -12, opacity: 0, ease: 'none', scrollTrigger: trigger })
}

/** Restrained pointer parallax, desktop only. Returns a disposer. */
export const heroPointer = (root: HTMLElement): (() => void) => {
  const image = root.querySelector('[data-hero-image]')
  const content = root.querySelector('[data-hero-content]')
  if (!image || !content) return () => undefined

  const imageX = gsap.quickTo(image, 'x', { duration: 0.9, ease: 'power3.out' })
  const imageY = gsap.quickTo(image, 'y', { duration: 0.9, ease: 'power3.out' })
  const contentX = gsap.quickTo(content, 'x', { duration: 1.1, ease: 'power3.out' })

  const onMove = (event: MouseEvent) => {
    const nx = event.clientX / window.innerWidth - 0.5
    const ny = event.clientY / window.innerHeight - 0.5
    imageX(nx * -18)
    imageY(ny * -12)
    contentX(nx * 10)
  }

  root.addEventListener('mousemove', onMove)
  return () => root.removeEventListener('mousemove', onMove)
}