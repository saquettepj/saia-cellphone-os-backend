import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class InvalidExcelFormatError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_INVALID_EXCEL_FORMAT))
    this.name = TranslationKeysEnum.ERROR_INVALID_EXCEL_FORMAT
  }
}

export { InvalidExcelFormatError }
