import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { refreshScrollTriggers } from '@/animations/scrollAnimations'
import { defaultLanguage, dictionaries, isLanguage } from '@/i18n/translations'
import type { Dictionary, Language } from '@/i18n/translations'

const STORAGE_KEY = 'aureon:lang'

interface LanguageContextValue {
  language: Language
  dir: 'rtl' | 'ltr'
  isRTL: boolean
  t: Dictionary
  setLanguage: (next: Language) => void
  toggleLanguage: () => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

const readStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLanguage(stored)) return stored
  } catch {
    /* storage unavailable */
  }
  return defaultLanguage
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage)
  const [switching, setSwitching] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const setLanguage = useCallback(
    (next: Language) => {
      if (next === language) return
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        setLanguageState(next)
        return
      }
      setSwitching(true)
      timers.current.push(
        window.setTimeout(() => {
          setLanguageState(next)
          timers.current.push(window.setTimeout(() => setSwitching(false), 60))
        }, 180),
      )
    },
    [language],
  )

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'fa' ? 'en' : 'fa')
  }, [language, setLanguage])

  useEffect(() => {
    const root = document.documentElement
    root.lang = language
    root.dir = language === 'fa' ? 'rtl' : 'ltr'
    root.dataset.lang = language
    document.title = dictionaries[language].meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', dictionaries[language].meta.description)
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      /* storage unavailable */
    }
    refreshScrollTriggers()
  }, [language])

  useEffect(() => {
    document.documentElement.dataset.switching = switching ? 'true' : 'false'
  }, [switching])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      dir: language === 'fa' ? 'rtl' : 'ltr',
      isRTL: language === 'fa',
      t: dictionaries[language],
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}