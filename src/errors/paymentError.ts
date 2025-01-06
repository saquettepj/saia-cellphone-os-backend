import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class PaymentError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_PAYMENT))
    this.name = TranslationKeysEnum.ERROR_PAYMENT
  }
}

export { PaymentError }
