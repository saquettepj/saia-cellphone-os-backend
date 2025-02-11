import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class NfeConfigurationNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_NFE_CONFIGURATION_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_NFE_CONFIGURATION_NOT_FOUND
  }
}

export { NfeConfigurationNotFoundError }
