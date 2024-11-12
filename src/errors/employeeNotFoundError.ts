import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class EmployeeNotFoundError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND
  }
}

export { EmployeeNotFoundError }
