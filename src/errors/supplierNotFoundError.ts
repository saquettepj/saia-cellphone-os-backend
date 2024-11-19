import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class SupplierNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_SUPPLIER_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_SUPPLIER_NOT_FOUND
  }
}

export { SupplierNotFoundError }
