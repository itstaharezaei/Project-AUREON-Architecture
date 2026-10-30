import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { gsap, useGSAP } from '@/animations/gsap'
import { scrollToSection } from '@/animations/scrollAnimations'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { Container } from '@/components/ui/Container'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { navItems } from '@/data/site'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useLanguage } from '@/hooks/useLanguage'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

const sectionIds = navItems.map((item) => item.id)

export function Header() {
  const { t } = useLanguage()
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(sectionIds)
  const scope = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 32))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useGSAP(
    () => {
      if (reduceMotion) return
      gsap.from(scope.current, { yPercent: -110, autoAlpha: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
    },
    { scope, dependencies: [reduceMotion] },
  )

  const handleNav = (href: string) => {
    setMenuOpen(false)
    scrollToSection(href)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-sm focus:text-bg"
      >
        {t.a11y.skipToContent}
      </a>

      <header
        ref={scope}
        data-scrolled={scrolled}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500',
          scrolled
            ? 'glass border-b border-b-(--glass-line) text-ink shadow-[0_10px_40px_-24px_rgb(0_0_0/0.4)]'
            : 'border-b border-b-transparent bg-gradient-to-b from-black/50 to-transparent text-[#f2f0e9]',
        )}
      >
        <Container
          className={cn(
            'flex items-center justify-between gap-6 transition-[height] duration-500 ease-out',
            scrolled ? 'h-16' : 'h-20 sm:h-24',
          )}
        >
          <a
            href="#hero"
            onClick={(event) => {
              event.preventDefault()
              handleNav('#hero')
            }}
            className="group/logo flex items-baseline gap-2"
            aria-label="AUREON Architecture"
          >
            <span className="text-lg font-extrabold tracking-[0.32em] transition-colors duration-300 group-hover/logo:text-accent sm:text-xl">
              AUREON
            </span>
            <span aria-hidden className="size-1.5 rounded-full bg-accent transition-transform duration-300 group-hover/logo:scale-150" />
          </a>

          <nav aria-label={t.a11y.mainNavigation} className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                data-active={active === item.id}
                onClick={(event) => {
                  event.preventDefault()
                  handleNav(item.href)
                }}
                className={cn(
                  'link-underline text-sm font-semibold tracking-wide transition-colors duration-300 hover:text-accent',
                  active === item.id && 'text-accent',
                )}
              >
                {t.nav[item.label]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle className={cn(!scrolled && 'border-white/25 text-[#f2f0e9] hover:border-accent')} />
            <ThemeToggle className={cn(!scrolled && 'border-white/25 text-[#f2f0e9] hover:border-accent')} />
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.a11y.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                'grid size-10 place-items-center rounded-full border transition-colors duration-300 hover:border-accent hover:text-accent lg:hidden',
                scrolled ? 'border-line text-ink' : 'border-white/25 text-[#f2f0e9]',
              )}
            >
              <Menu aria-hidden className="size-4" />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusTo={menuButton} />
    </>
  )
}