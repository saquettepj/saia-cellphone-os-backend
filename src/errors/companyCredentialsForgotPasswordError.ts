import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class CompanyCredentialsForgotPasswordError extends Error {
  constructor() {
    super(
      translate(TranslationKeysEnum.ERROR_COMPANY_CREDENTIALS_FORGOT_PASSWORD),
    )
    this.name = TranslationKeysEnum.ERROR_COMPANY_CREDENTIALS_FORGOT_PASSWORD
  }
}

export { CompanyCredentialsForgotPasswordError }
