import { TranslationKeysEnum } from "./enums/TranslationKeysEnum";
import { en } from "./languages/en";
import { ptBR } from "./languages/pt-br";

const translations = {
  pt: ptBR,
  en: en
};

export function translate(
  textKey: TranslationKeysEnum,
  locale: 'en' | 'pt' = 'pt'
): string {
  return translations[locale]?.[textKey] || 'TRANSLATION ERROR';
}
