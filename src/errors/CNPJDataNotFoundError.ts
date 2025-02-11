import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class CNPJDataNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_FETCHING_COMPANY_DATA))
    this.name = TranslationKeysEnum.ERROR_FETCHING_COMPANY_DATA
  }
}

export { CNPJDataNotFoundError }
