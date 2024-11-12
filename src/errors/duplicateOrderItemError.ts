import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class DuplicateOrderItemError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_DUPLICATE_ORDER_ITEM))
    this.name = TranslationKeysEnum.ERROR_DUPLICATE_ORDER_ITEM
  }
}

export { DuplicateOrderItemError }
