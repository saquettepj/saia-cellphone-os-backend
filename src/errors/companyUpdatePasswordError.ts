import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class CompanyUpdatePasswordError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_COMPANY_UPDATE_PASSWORD))
    this.name = TranslationKeysEnum.ERROR_COMPANY_UPDATE_PASSWORD
  }
}

export { CompanyUpdatePasswordError }
