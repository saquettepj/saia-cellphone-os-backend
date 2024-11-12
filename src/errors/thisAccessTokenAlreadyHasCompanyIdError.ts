import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class ThisAccessTokenAlreadyHasCompanyIdError extends Error {
  constructor() {
    super(
      translate(
        TranslationKeysEnum.ERROR_THIS_ACCESS_TOKEN_ALREADY_HAS_COMPANY_ID,
      ),
    )
    this.name =
      TranslationKeysEnum.ERROR_THIS_ACCESS_TOKEN_ALREADY_HAS_COMPANY_ID
  }
}

export { ThisAccessTokenAlreadyHasCompanyIdError }
