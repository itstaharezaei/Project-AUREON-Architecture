import type { Language } from '@/i18n/translations'

const locales: Record<Language, string> = { fa: 'fa-IR', en: 'en-US' }

export const formatNumber = (value: number, language: Language): string =>
  new Intl.NumberFormat(locales[language]).format(value)

export const formatPlainNumber = (value: number, language: Language): string =>
  new Intl.NumberFormat(locales[language], { useGrouping: false }).format(value)

export const padIndex = (value: number): string => String(value).padStart(2, '0')