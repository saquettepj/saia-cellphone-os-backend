/* eslint-disable camelcase */
import { MercadoPagoConfig, Payment } from 'mercadopago'

import { PaymentNotificationError } from '@/errors/paymentNotificationError'

interface IGetIPNPaymentNotificationUseCaseRequest {
  id: string | number
}

class GetIPNPaymentNotificationUseCase {
  private paymentClient: Payment

  constructor() {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_KEY || '',
    })

    this.paymentClient = new Payment(client)
  }

  async execute({ id }: IGetIPNPaymentNotificationUseCaseRequest) {
    try {
      const paymentResponse = await this.paymentClient.get({ id })

      if (!paymentResponse) {
        throw new PaymentNotificationError()
      }

      return {
        id: paymentResponse.id,
        status: paymentResponse.status,
        status_detail: paymentResponse.status_detail,
        transaction_amount: paymentResponse.transaction_amount,
        payer_email: paymentResponse.payer?.email,
      }
    } catch (error) {
      throw error
    }
  }
}

export {
  GetIPNPaymentNotificationUseCase,
  IGetIPNPaymentNotificationUseCaseRequest,
}
