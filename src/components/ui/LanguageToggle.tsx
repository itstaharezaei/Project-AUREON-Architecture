import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

export function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage, t } = useLanguage()
  const target = language === 'fa' ? 'EN' : 'FA'

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t.a11y.switchLanguage}
      title={t.a11y.switchLanguage}
      className={cn(
        'group/lang flex h-10 items-center gap-2 rounded-full border border-line px-4 text-xs font-bold tracking-[0.18em] text-ink transition-colors duration-300 hover:border-accent hover:text-accent',
        className,
      )}
    >
      <span className="relative block h-4 overflow-hidden">
        <span className="block transition-transform duration-400 ease-out group-hover/lang:-translate-y-4">
          {target}
        </span>
        <span
          aria-hidden
          className="absolute inset-x-0 top-4 block transition-transform duration-400 ease-out group-hover/lang:-translate-y-4"
        >
          {target}
        </span>
      </span>
    </button>
  )
}