import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class DeletingError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_DELETING))
    this.name = TranslationKeysEnum.ERROR_DELETING
  }
}

export { DeletingError }
