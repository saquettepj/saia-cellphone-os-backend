import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class DeleteDateNotAllowed extends Error {
  constructor() {
    super(
      translate(
        TranslationKeysEnum.ERROR_NOT_ALLOWED_TO_DELETE_ITEM_AFTER_24HRS,
      ),
    )
    this.name = TranslationKeysEnum.ERROR_NOT_ALLOWED_TO_DELETE_ITEM_AFTER_24HRS
  }
}

export { DeleteDateNotAllowed }
