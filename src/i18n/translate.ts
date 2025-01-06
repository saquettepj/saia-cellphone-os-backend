import { TranslationKeysEnum } from './enums/TranslationKeysEnum'
import { en } from './languages/en'
import { ptBR } from './languages/pt-br'
import { getGlobalLocale } from './localeSetting'

const translations = {
  pt: ptBR,
  en,
}

export type ILocale = 'en' | 'pt'

export function translate(key: TranslationKeysEnum): string {
  const locale = getGlobalLocale()
  const dictionary: { [key: string]: string } = translations[locale]
  return dictionary[key] || 'TRANSLATION ERROR'
}
