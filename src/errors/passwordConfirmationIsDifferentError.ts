import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

class PasswordConfirmationIsDifferentError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_PASSWORD_CONFIRMATION_DIFFERENT))
    this.name = TranslationKeysEnum.ERROR_PASSWORD_CONFIRMATION_DIFFERENT
  }
}

export { PasswordConfirmationIsDifferentError }
