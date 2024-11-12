import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class RequestParamsNotReachedError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_REQUEST_PARAMS_NOT_REACHED))
    this.name = TranslationKeysEnum.ERROR_REQUEST_PARAMS_NOT_REACHED
  }
}

export { RequestParamsNotReachedError }
