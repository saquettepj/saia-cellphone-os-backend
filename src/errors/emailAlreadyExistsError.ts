import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class EmailAlreadyExistsError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_EMAIL_ALREADY_EXISTS))
    this.name = TranslationKeysEnum.ERROR_EMAIL_ALREADY_EXISTS
  }
}

export { EmailAlreadyExistsError }
