import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class ProductNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_PRODUCT_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_PRODUCT_NOT_FOUND
  }
}

export { ProductNotFoundError }
