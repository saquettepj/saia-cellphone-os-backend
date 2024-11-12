import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class CompanyCNPJAlreadyExistsError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_COMPANY_CNPJ_ALREADY_EXISTS))
    this.name = TranslationKeysEnum.ERROR_COMPANY_CNPJ_ALREADY_EXISTS
  }
}

export { CompanyCNPJAlreadyExistsError }
