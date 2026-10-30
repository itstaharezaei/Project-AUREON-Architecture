import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { ArrowUpLeft, ArrowUpRight, X } from 'lucide-react'
import { gsap, useGSAP } from '@/animations/gsap'
import { scrollToSection } from '@/animations/scrollAnimations'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { navItems, socialLinks, studioEmail, studioPhone, studioPhoneHref } from '@/data/site'
import { useLanguage } from '@/hooks/useLanguage'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { padIndex } from '@/utils/format'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  returnFocusTo: RefObject<HTMLButtonElement | null>
}

export function MobileMenu({ open, onClose, returnFocusTo }: MobileMenuProps) {
  const { t, isRTL } = useLanguage()
  const reduceMotion = useReducedMotion()
  const scope = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const wasOpen = useRef(false)
  const Arrow = isRTL ? ArrowUpLeft : ArrowUpRight

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      if (reduceMotion) {
        gsap.set(root, { autoAlpha: 0 })
        return
      }

      const links = root.querySelectorAll('[data-menu-link]')
      const meta = root.querySelectorAll('[data-menu-meta]')
      gsap.set(root, { autoAlpha: 0 })
      gsap.set(links, { yPercent: 120 })
      gsap.set(meta, { autoAlpha: 0, y: 24 })

      timeline.current = gsap
        .timeline({ paused: true })
        .to(root, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' })
        .to(links, { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'power4.out' }, '-=0.15')
        .to(meta, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
    },
    { scope, dependencies: [reduceMotion] },
  )

  useEffect(() => {
    const root = scope.current
    if (!root) return

    if (open) {
      document.body.style.overflow = 'hidden'
      if (reduceMotion) gsap.set(root, { autoAlpha: 1 })
      else {
        gsap.set(root, { visibility: 'visible' })
        timeline.current?.play()
      }
      root.querySelector<HTMLElement>('[data-menu-link] a')?.focus()
    } else {
      document.body.style.overflow = ''
      if (reduceMotion) gsap.set(root, { autoAlpha: 0 })
      else timeline.current?.reverse()
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open, reduceMotion])

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) returnFocusTo.current?.focus()
      wasOpen.current = false
      return
    }
    wasOpen.current = true

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = scope.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, returnFocusTo])

  const handleNav = (href: string) => {
    onClose()
    scrollToSection(href)
  }

  return (
    <div
      ref={scope}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t.a11y.mobileNavigation}
      className="mesh fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
    >
      <div className="flex h-20 items-center justify-between px-5 sm:px-8">
        <span className="text-lg font-extrabold tracking-[0.32em]">AUREON</span>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.a11y.closeMenu}
            className="grid size-10 place-items-center rounded-full border border-line transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      <nav aria-label={t.a11y.mobileNavigation} className="flex flex-1 flex-col justify-center gap-2 px-5 sm:px-8">
        {navItems.map((item, index) => (
          <div key={item.id} data-menu-link className="overflow-hidden">
            <a
              href={item.href}
              onClick={(event) => {
                event.preventDefault()
                handleNav(item.href)
              }}
              className="group flex items-baseline gap-4 py-2"
            >
              <span className="eyebrow text-accent">{padIndex(index + 1)}</span>
              <span className="display text-[clamp(2.5rem,11vw,4.5rem)] transition-colors duration-300 group-hover:text-accent">
                {t.nav[item.label]}
              </span>
              <Arrow
                aria-hidden
                className="size-6 text-accent opacity-0 transition-all duration-300 group-hover:opacity-100"
              />
            </a>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-5 border-t border-line px-5 py-8 sm:px-8">
        <div data-menu-meta className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-muted">
          <a href={`mailto:${studioEmail}`} className="link-underline hover:text-accent">
            {studioEmail}
          </a>
          <a href={studioPhoneHref} className="link-underline hover:text-accent" dir="ltr">
            {studioPhone}
          </a>
        </div>
        <div data-menu-meta className="flex items-center gap-6">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs font-bold tracking-[0.18em] text-muted uppercase transition-colors hover:text-accent"
            >
              {social.id}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}