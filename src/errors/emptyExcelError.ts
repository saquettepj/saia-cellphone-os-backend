import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class EmptyExcelError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_EMPTY_EXCEL))
    this.name = TranslationKeysEnum.ERROR_EMPTY_EXCEL
  }
}

export { EmptyExcelError }
