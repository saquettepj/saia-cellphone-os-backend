import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class ProductDescriptionAlreadyExistsError extends Error {
  constructor() {
    super(
      translate(TranslationKeysEnum.ERROR_PRODUCT_DESCRIPTION_ALREADY_EXISTS),
    )
    this.name = TranslationKeysEnum.ERROR_PRODUCT_DESCRIPTION_ALREADY_EXISTS
  }
}

export { ProductDescriptionAlreadyExistsError }
