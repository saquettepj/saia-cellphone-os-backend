import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class EmailNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_EMAIL_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_EMAIL_NOT_FOUND
  }
}

export { EmailNotFoundError }
