import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class OnlyOneEntityError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_ONLY_ONE_ENTITY))
    this.name = TranslationKeysEnum.ERROR_ONLY_ONE_ENTITY
  }
}

export { OnlyOneEntityError }
