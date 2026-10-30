import { gsap, ScrollTrigger } from './gsap'

/** Desktop: pinned panel, statements cross-fade while the collage drifts. */
export const philosophyPin = (panel: HTMLElement): void => {
  const statements = panel.querySelectorAll('[data-statement]')
  const first = panel.querySelector('[data-phil-a]')
  const second = panel.querySelector('[data-phil-b]')
  const progress = panel.querySelector('[data-phil-progress]')

  gsap.set(statements, { autoAlpha: 0, y: 48 })
  gsap.set(statements[0], { autoAlpha: 1, y: 0 })

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: panel,
      start: 'top top',
      end: '+=220%',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
    },
  })

  statements.forEach((statement, index) => {
    if (index > 0) {
      timeline.to(statement, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, index * 2)
    }
    if (index < statements.length - 1) {
      timeline.to(statement, { autoAlpha: 0, y: -48, duration: 1, ease: 'power2.in' }, index * 2 + 1)
    }
  })

  timeline
    .fromTo(first, { yPercent: 6, rotate: -1.5 }, { yPercent: -6, rotate: 0.5, ease: 'none', duration: 6 }, 0)
    .fromTo(second, { yPercent: -8, xPercent: 4 }, { yPercent: 8, xPercent: -4, ease: 'none', duration: 6 }, 0)
    .fromTo(progress, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 6 }, 0)
}

/** Mobile: no pin — each statement and image reveals on its own. */
export const philosophyFlow = (panel: HTMLElement): void => {
  const statements = panel.querySelectorAll('[data-statement]')
  const images = panel.querySelectorAll('[data-phil-a], [data-phil-b]')

  statements.forEach((statement) => {
    gsap.fromTo(
      statement,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: statement, start: 'top 88%', once: true },
      },
    )
  })

  images.forEach((image) => {
    gsap.fromTo(
      image,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })
}

export const philosophyStatic = (panel: HTMLElement): void => {
  gsap.set(panel.querySelectorAll('[data-statement]'), { autoAlpha: 1, y: 0 })
  ScrollTrigger.refresh()
}