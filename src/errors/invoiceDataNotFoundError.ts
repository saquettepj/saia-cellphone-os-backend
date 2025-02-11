import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class InvoiceDataNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_INVOICE_DATA_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_INVOICE_DATA_NOT_FOUND
  }
}

export { InvoiceDataNotFoundError }
