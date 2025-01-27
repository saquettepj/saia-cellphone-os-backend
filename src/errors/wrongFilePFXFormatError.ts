import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class WrongFilePFXFormatError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_INVALID_FILE))
    this.name = TranslationKeysEnum.ERROR_INVALID_FILE
  }
}

export { WrongFilePFXFormatError }
