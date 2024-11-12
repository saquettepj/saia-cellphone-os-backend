import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class AccessTokenNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_ACCESS_TOKEN_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_ACCESS_TOKEN_NOT_FOUND
  }
}

export { AccessTokenNotFoundError }
