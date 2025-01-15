import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class SendEmailError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_SEND_EMAIL))
    this.name = TranslationKeysEnum.ERROR_SEND_EMAIL
  }
}

export { SendEmailError }
