import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class PaymentNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_LAST_PAYMENT_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_LAST_PAYMENT_NOT_FOUND
  }
}

export { PaymentNotFoundError }
