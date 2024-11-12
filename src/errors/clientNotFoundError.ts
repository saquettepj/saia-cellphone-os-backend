import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class ClientNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND
  }
}

export { ClientNotFoundError }
