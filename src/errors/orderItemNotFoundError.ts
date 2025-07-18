import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class OrderItemNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_ORDER_ITEM_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_ORDER_ITEM_NOT_FOUND
  }
}

export { OrderItemNotFoundError }
