import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class InvalidExcelHeadersError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_INVALID_EXCEL_HEADERS))
    this.name = TranslationKeysEnum.ERROR_INVALID_EXCEL_HEADERS
  }
}

export { InvalidExcelHeadersError }
