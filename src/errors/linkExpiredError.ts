import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class LinkExpiredError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_LINK_EXPIRED))
    this.name = TranslationKeysEnum.ERROR_LINK_EXPIRED
  }
}

export { LinkExpiredError }
