import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class CompanyNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_COMPANY_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_COMPANY_NOT_FOUND
  }
}

export { CompanyNotFoundError }
