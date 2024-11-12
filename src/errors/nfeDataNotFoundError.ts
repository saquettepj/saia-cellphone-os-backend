import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class NfeDataNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_NFE_DATA_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_NFE_DATA_NOT_FOUND
  }
}

export { NfeDataNotFoundError }
