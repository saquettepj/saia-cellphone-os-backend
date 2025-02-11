import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class SefazUnstableError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_SEFAZ_UNSTABLE))
    this.name = TranslationKeysEnum.ERROR_SEFAZ_UNSTABLE
  }
}

export { SefazUnstableError }
