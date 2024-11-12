import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class AnAccessTokenAlreadyHasCompanyIdError extends Error {
  constructor() {
    super(
      translate(TranslationKeysEnum.ERROR_ACCESS_TOKEN_ALREADY_HAS_COMPANY_ID),
    )
    this.name = TranslationKeysEnum.ERROR_ACCESS_TOKEN_ALREADY_HAS_COMPANY_ID
  }
}

export { AnAccessTokenAlreadyHasCompanyIdError }
