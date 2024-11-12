import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class CPFAlreadyExistsError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_CPF_ALREADY_EXISTS))
    this.name = TranslationKeysEnum.ERROR_CPF_ALREADY_EXISTS
  }
}

export { CPFAlreadyExistsError }
