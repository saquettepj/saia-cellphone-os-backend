import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class SystemConfigNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_SYSTEM_CONFIG_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_SYSTEM_CONFIG_NOT_FOUND
  }
}

export { SystemConfigNotFoundError }
