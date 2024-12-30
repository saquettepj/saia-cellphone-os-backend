import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class UpdatingError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_UPDATING))
    this.name = TranslationKeysEnum.ERROR_UPDATING
  }
}

export { UpdatingError }
