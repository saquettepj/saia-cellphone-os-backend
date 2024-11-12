import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class ClientHasAddressError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_CLIENT_HAS_ADDRESS))
    this.name = TranslationKeysEnum.ERROR_CLIENT_HAS_ADDRESS
  }
}

export { ClientHasAddressError }
