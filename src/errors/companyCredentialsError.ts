import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class CompanyCredentialsError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_COMPANY_CREDENTIALS))
    this.name = TranslationKeysEnum.ERROR_COMPANY_CREDENTIALS
  }
}

export { CompanyCredentialsError }
