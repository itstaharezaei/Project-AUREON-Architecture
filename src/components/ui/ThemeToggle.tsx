import { Moon, Sun } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t.a11y.switchToLight : t.a11y.switchToDark}
      title={isDark ? t.a11y.switchToLight : t.a11y.switchToDark}
      className={cn(
        'relative grid size-10 place-items-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-accent hover:text-accent',
        className,
      )}
    >
      <Sun
        aria-hidden
        className={cn(
          'absolute size-4 transition-all duration-500 ease-out',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          'absolute size-4 transition-all duration-500 ease-out',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
      />
    </button>
  )
}