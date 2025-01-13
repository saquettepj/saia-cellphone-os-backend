import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class ClientNameNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_CLIENT_NAME_NOT_FOUND_BY_CPF))
    this.name = TranslationKeysEnum.ERROR_CLIENT_NAME_NOT_FOUND_BY_CPF
  }
}

export { ClientNameNotFoundError }
