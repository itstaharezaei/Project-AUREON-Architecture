import { en } from './en'
import { fa } from './fa'

export const languages = ['fa', 'en'] as const

export type Language = (typeof languages)[number]

export type Dictionary = typeof en

export const dictionaries: Record<Language, Dictionary> = { fa, en }

export const defaultLanguage: Language = 'fa'

export const isLanguage = (value: unknown): value is Language => value === 'fa' || value === 'en'