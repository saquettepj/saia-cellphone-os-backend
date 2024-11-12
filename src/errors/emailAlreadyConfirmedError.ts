import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class EmailAlreadyConfirmedError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_EMAIL_ALREADY_CONFIRMED))
    this.name = TranslationKeysEnum.ERROR_EMAIL_ALREADY_CONFIRMED
  }
}

export { EmailAlreadyConfirmedError }
