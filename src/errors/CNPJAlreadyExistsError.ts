import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class CNPJAlreadyExistsError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_CNPJ_ALREADY_EXISTS))
    this.name = TranslationKeysEnum.ERROR_CNPJ_ALREADY_EXISTS
  }
}

export { CNPJAlreadyExistsError }
