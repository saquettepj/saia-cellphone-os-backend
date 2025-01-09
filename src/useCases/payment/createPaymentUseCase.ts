/* eslint-disable camelcase */
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { PaymentCreateRequest } from 'mercadopago/dist/clients/payment/create/types'

import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'
import { translate } from '@/i18n/translate'
import { PaymentError } from '@/errors/paymentError'
import { env } from '@/env'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { returnPayType } from '@/utils/returnPayType'

interface ICreatePaymentUseCaseRequest {
  companyId: string
  paymentCreateData: PaymentCreateRequest
}

class CreatePaymentUseCase {
  private paymentClient: Payment

  constructor(private companyRepository: ICompanyRepository) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_KEY || '',
      options: { timeout: 5000 },
    })

    this.paymentClient = new Payment(client)
  }

  async execute({
    companyId,
    paymentCreateData,
  }: ICreatePaymentUseCaseRequest) {
    const body = {
      ...paymentCreateData,
      description: translate(
        TranslationKeysEnum.PAYMENT_DESCRIPTION_MONTHLY_PLAN,
      ),
      ...(paymentCreateData.payment_method_id === 'pix' && {
        date_of_expiration: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      }),
    }

    try {
      const paymentResponse = await this.paymentClient.create({ body })

      if (paymentResponse?.id) {
        await this.companyRepository.updateById(companyId, {
          payId: !paymentResponse.date_approved
            ? paymentResponse.id.toString()
            : null,
          payType: returnPayType(paymentResponse.transaction_amount),
          payDate: paymentResponse.date_approved
            ? new Date(paymentResponse.date_approved)
            : undefined,
        })
      }

      return {
        id: paymentResponse.id,
        status: paymentResponse.status,
        date_approved: paymentResponse.date_approved,
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
