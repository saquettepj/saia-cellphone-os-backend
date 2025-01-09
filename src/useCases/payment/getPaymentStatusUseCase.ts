import { MercadoPagoConfig, Payment } from 'mercadopago'

import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { PaymentNotFoundError } from '@/errors/paymentNotFoundError'
import { returnPayType } from '@/utils/returnPayType'

interface IGetPaymentStatusUseCaseRequest {
  companyId: string
}

interface IGetPaymentStatusUseCaseResponse {
  id?: string | number
  status?: string
  date_approved?: string | Date
  status_detail?: string
  transaction_amount?: number
  payer_email?: string
}

class GetPaymentStatusUseCase {
  private paymentClient: Payment

  constructor(private companyRepository: ICompanyRepository) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_KEY || '',
    })

    this.paymentClient = new Payment(client)
  }

  async execute({
    companyId,
  }: IGetPaymentStatusUseCaseRequest): Promise<IGetPaymentStatusUseCaseResponse> {
    try {
      const searchedCompany = await this.companyRepository.findById(companyId)

      if (!searchedCompany) {
        throw new CompanyNotFoundError()
      }

      if (searchedCompany.payId) {
        const paymentResponse = await this.paymentClient.get({
          id: searchedCompany.payId,
        })

        if (!paymentResponse) {
          throw new PaymentNotFoundError()
        }

        if (paymentResponse?.id && paymentResponse.date_approved) {
          await this.companyRepository.updateById(companyId, {
            payId: null,
            payType: returnPayType(paymentResponse.transaction_amount),
            payDate: new Date(paymentResponse.date_approved),
          })
        }

        return {
          id: paymentResponse?.id,
          status: paymentResponse?.status,
          date_approved: paymentResponse.date_approved,
          status_detail: paymentResponse?.status_detail,
          transaction_amount: paymentResponse?.transaction_amount,
          payer_email: paymentResponse?.payer?.email,
        }
      } else {
        return {}
      }
    } catch (error) {
      throw new PaymentNotFoundError()
    }
  }
}

export {
  GetPaymentStatusUseCase,
  IGetPaymentStatusUseCaseRequest,
  IGetPaymentStatusUseCaseResponse,
}
