import { gsap } from './gsap'

/** Six-beat pinned story: grow, approach, intro, details, specs, return. */
export const featuredStory = (stage: HTMLElement, getRTL: () => boolean): void => {
  const media = stage.querySelector('[data-feat-media]')
  const image = stage.querySelector('[data-feat-image]')
  const intro = stage.querySelector('[data-feat-intro]')
  const details = stage.querySelector('[data-feat-details]')
  const detailItems = stage.querySelectorAll('[data-feat-detail]')
  const specs = stage.querySelector('[data-feat-specs]')
  const closing = stage.querySelector('[data-feat-closing]')

  const dir = () => (getRTL() ? -1 : 1)
  const window = () => (getRTL() ? 'inset(8% 6% 8% 52%)' : 'inset(8% 52% 8% 6%)')

  gsap.set(image, { scale: 1 })
  gsap.set([intro, specs], { autoAlpha: 0, y: 44 })
  gsap.set(details, { autoAlpha: 0 })
  gsap.set(detailItems, { autoAlpha: 0, y: 60 })
  gsap.set(closing, { autoAlpha: 0 })

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=320%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    .to(image, { scale: 1.55, xPercent: () => -6 * dir(), duration: 2 }, 0)
    .to(intro, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, 1.7)
    .to(intro, { autoAlpha: 0, y: -32, duration: 0.8, ease: 'power2.in' }, 4.2)
    .to(
      media,
      { clipPath: window, duration: 1.6, ease: 'power2.inOut' },
      4.6,
    )
    .to(image, { scale: 1.25, xPercent: 0, duration: 1.6, ease: 'power2.inOut' }, 4.6)
    .fromTo(
      details,
      { autoAlpha: 0, x: () => 60 * dir() },
      { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power2.out' },
      5.5,
    )
    .to(detailItems, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.45, ease: 'power2.out' }, 5.7)
    .to(specs, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, 7.6)
    .to(details, { autoAlpha: 0, x: () => 40 * dir(), duration: 0.8, ease: 'power2.in' }, 9.2)
    .to(specs, { autoAlpha: 0, duration: 0.6 }, 9.4)
    .to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power2.inOut' }, 9.9)
    .to(image, { scale: 1, duration: 1.6, ease: 'power2.inOut' }, 9.9)
    .to(closing, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, 10.8)
}

/** Mobile: the same content as a calm vertical read. */
export const featuredFlow = (stage: HTMLElement): void => {
  const image = stage.querySelector('[data-feat-image]')
  const blocks = stage.querySelectorAll(
    '[data-feat-intro], [data-feat-details], [data-feat-specs], [data-feat-closing]',
  )

  if (image) {
    gsap.fromTo(
      image,
      { yPercent: -6, scale: 1.12 },
      {
        yPercent: 6,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  }

  blocks.forEach((block) => {
    gsap.fromTo(
      block,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: block, start: 'top 88%', once: true },
      },
    )
  })
}

export const featuredStatic = (stage: HTMLElement): void => {
  gsap.set(
    stage.querySelectorAll(
      '[data-feat-intro], [data-feat-details], [data-feat-detail], [data-feat-specs], [data-feat-closing]',
    ),
    { autoAlpha: 1, x: 0, y: 0 },
  )
}