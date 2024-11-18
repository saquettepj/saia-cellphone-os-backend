import { TranslationKeysEnum } from './enums/TranslationKeysEnum'
import { en } from './languages/en'
import { ptBR } from './languages/pt-br'
import { getGlobalLocale } from './localeSetting'

const translations = {
  pt: ptBR,
  en,
}

export type ILocale = 'en' | 'pt'

export function translate(textKey: TranslationKeysEnum): string {
  const locale = getGlobalLocale()
  return translations[locale]?.[textKey] || 'TRANSLATION ERROR'
}
