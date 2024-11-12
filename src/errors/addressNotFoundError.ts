import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class AddressNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_ADDRESS_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_ADDRESS_NOT_FOUND
  }
}

export { AddressNotFoundError }
