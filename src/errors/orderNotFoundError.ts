import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class OrderNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_ORDER_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_ORDER_NOT_FOUND
  }
}

export { OrderNotFoundError }
