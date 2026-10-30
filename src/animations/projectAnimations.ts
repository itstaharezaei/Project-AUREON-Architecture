import { gsap } from './gsap'
import type { ScrollTrigger } from './gsap'

export interface HorizontalGallery {
  tween: gsap.core.Tween
  trigger: ScrollTrigger
}

/** Vertical scroll drives the horizontal track; RTL travels the opposite way. */
export const horizontalGallery = (
  section: HTMLElement,
  track: HTMLElement,
  getRTL: () => boolean,
  onProgress: (progress: number) => void,
): HorizontalGallery => {
  const distance = () => Math.max(0, track.scrollWidth - section.clientWidth)

  const tween = gsap.to(track, {
    x: () => (getRTL() ? distance() : -distance()),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => onProgress(self.progress),
    },
  })

  return { tween, trigger: tween.scrollTrigger as ScrollTrigger }
}

/** Image drift inside each card, relative to the horizontal container animation. */
export const cardParallax = (
  card: HTMLElement,
  tween: gsap.core.Tween,
  getRTL: () => boolean,
): void => {
  const media = card.querySelector('[data-card-media]')
  if (!media) return

  gsap.fromTo(
    media,
    { xPercent: () => (getRTL() ? 7 : -7) },
    {
      xPercent: () => (getRTL() ? -7 : 7),
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        containerAnimation: tween,
        start: () => (getRTL() ? 'right left' : 'left right'),
        end: () => (getRTL() ? 'left right' : 'right left'),
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  )
}

export const galleryEntrance = (section: HTMLElement, cards: NodeListOf<Element>): void => {
  gsap.from(cards, {
    y: 70,
    autoAlpha: 0,
    duration: 1,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 72%', once: true },
  })
}