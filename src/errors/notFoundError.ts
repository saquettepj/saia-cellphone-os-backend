import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class NotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_NOT_FOUND
  }
}

export { NotFoundError }
