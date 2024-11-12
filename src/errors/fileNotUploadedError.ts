import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class FileNotUploadedError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_FILE_NOT_UPLOADED))
    this.name = TranslationKeysEnum.ERROR_FILE_NOT_UPLOADED
  }
}

export { FileNotUploadedError }
