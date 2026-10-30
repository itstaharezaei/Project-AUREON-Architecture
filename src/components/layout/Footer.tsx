import { ArrowUp } from 'lucide-react'
import { scrollToSection } from '@/animations/scrollAnimations'
import { Container } from '@/components/ui/Container'
import { navItems, socialLinks, studioEmail, studioPhone, studioPhoneHref } from '@/data/site'
import { useLanguage } from '@/hooks/useLanguage'
import { languages } from '@/i18n/translations'
import { cn } from '@/utils/cn'

export function Footer() {
  const { t, language, setLanguage } = useLanguage()

  return (
    <footer className="relative border-t border-line bg-bg-alt">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="flex flex-col gap-4">
          <span className="flex items-baseline gap-2 text-xl font-extrabold tracking-[0.32em]">
            AUREON
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
        </div>

        <nav aria-label={t.footer.navTitle} className="flex flex-col gap-3">
          <h3 className="eyebrow">{t.footer.navTitle}</h3>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => {
                event.preventDefault()
                scrollToSection(item.href)
              }}
              className="link-underline w-fit text-sm font-semibold hover:text-accent"
            >
              {t.nav[item.label]}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <h3 className="eyebrow">{t.footer.contactTitle}</h3>
          <a href={`mailto:${studioEmail}`} className="link-underline w-fit text-sm font-semibold hover:text-accent" dir="ltr">
            {studioEmail}
          </a>
          <a href={studioPhoneHref} className="link-underline w-fit text-sm font-semibold hover:text-accent" dir="ltr">
            {studioPhone}
          </a>
          <p className="text-sm text-muted">{t.contact.info.address}</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h3 className="eyebrow">{t.footer.followTitle}</h3>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline text-xs font-bold tracking-[0.16em] uppercase hover:text-accent"
                >
                  {social.id}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="eyebrow">{t.footer.languageTitle}</h3>
            <div className="flex gap-2">
              {languages.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  aria-pressed={language === code}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs font-bold tracking-[0.16em] uppercase transition-colors duration-300',
                    language === code
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-line hover:border-accent hover:text-accent',
                  )}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div aria-hidden className="overflow-hidden px-2">
        <p className="wordmark display-tight text-center text-[clamp(4rem,17vw,15rem)] leading-none">
          AUREON
        </p>
      </div>

      <Container className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
        <p className="text-xs text-muted">{t.footer.rights}</p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase transition-colors hover:text-accent"
        >
          {t.footer.backToTop}
          <ArrowUp aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      </Container>
    </footer>
  )
}