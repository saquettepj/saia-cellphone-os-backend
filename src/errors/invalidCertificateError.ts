import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class InvalidCertificateError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_INVALID_CERTIFICATE))
    this.name = TranslationKeysEnum.ERROR_INVALID_CERTIFICATE
  }
}

export { InvalidCertificateError }
