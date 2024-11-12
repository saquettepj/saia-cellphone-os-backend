import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class InvalidEmailConfirmationCodeError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_INVALID_EMAIL_CONFIRMATION_CODE))
    this.name = TranslationKeysEnum.ERROR_INVALID_EMAIL_CONFIRMATION_CODE
  }
}

export { InvalidEmailConfirmationCodeError }
