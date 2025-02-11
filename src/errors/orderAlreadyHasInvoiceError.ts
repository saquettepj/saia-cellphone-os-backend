import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class OrderAlreadyHasInvoiceError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_ORDER_ALREADY_HAS_INVOICE))
    this.name = TranslationKeysEnum.ERROR_ORDER_ALREADY_HAS_INVOICE
  }
}

export { OrderAlreadyHasInvoiceError }
