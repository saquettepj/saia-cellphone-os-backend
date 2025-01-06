/* eslint-disable camelcase */
import { MercadoPagoConfig, Payment } from 'mercadopago'

import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'
import { PaymentError } from '@/errors/paymentError'
import { env } from '@/env'

interface ICreatePaymentUseCaseRequest {
  transaction_amount: number
  payment_method_id: string
  payer: {
    email: string
  }
}

class CreatePaymentUseCase {
  private paymentClient: Payment

  constructor() {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_KEY || '',
      options: { timeout: 5000 },
    })

    this.paymentClient = new Payment(client)
  }

  async execute({
    transaction_amount,
    payment_method_id,
    payer,
  }: ICreatePaymentUseCaseRequest) {
    const body = {
      transaction_amount,
      description: translate(
        TranslationKeysEnum.PAYMENT_DESCRIPTION_MONTHLY_PLAN,
      ),
      payment_method_id,
      payer,
    }

    try {
      const paymentResponse = await this.paymentClient.create({ body })

      return {
        id: paymentResponse.id,
        status: paymentResponse.status,
        status_detail: paymentResponse.status_detail,
        transaction_amount: paymentResponse.transaction_amount,
        description: paymentResponse.description,
        payer: paymentResponse.payer,
      }
    } catch (error) {
      env.NODE_ENV !== 'production' &&
        console.error(
          ` Payment Error - 🔴 ${(error as Error)?.message || translate(TranslationKeysEnum.ERROR_UNKNOWN)} 🔴`,
        ) // Usar um log externo: Datadog||NewRelic||Sentry
      throw new PaymentError()
    }
  }
}

export { CreatePaymentUseCase, ICreatePaymentUseCaseRequest }
