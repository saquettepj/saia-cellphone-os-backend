import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'

class PaymentNotificationError extends Error {
  constructor() {
    super(translate(TranslationKeysEnum.ERROR_NOTIFICATION_NOT_FOUND))
    this.name = TranslationKeysEnum.ERROR_NOTIFICATION_NOT_FOUND
  }
}

export { PaymentNotificationError }
