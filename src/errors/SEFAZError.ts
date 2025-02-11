import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class SEFAZError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_SEFAZ_INSTABILITY))
    this.name = TranslationKeysEnum.ERROR_SEFAZ_INSTABILITY
  }
}

export { SEFAZError }
