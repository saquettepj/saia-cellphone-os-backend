import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class CompanyHasAddressError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_COMPANY_HAS_ADDRESS))
    this.name = TranslationKeysEnum.ERROR_COMPANY_HAS_ADDRESS
  }
}

export { CompanyHasAddressError }
