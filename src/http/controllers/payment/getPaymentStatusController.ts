import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetPaymentStatusUseCase } from '@/useCases/payment/factory/setupGetPaymentStatusUseCase'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { PaymentNotFoundError } from '@/errors/paymentNotFoundError'

interface IGetPaymentStatusControllerResponse {
  id?: string | number
  status?: string
  date_approved?: string | Date
  status_detail?: string
  transaction_amount?: number
  payer_email?: string
}

async function getPaymentStatusController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  try {
    const getPaymentStatusUseCase = setupGetPaymentStatusUseCase()

    const paymentStatus = await getPaymentStatusUseCase.execute({ companyId })

    const responseBody: IGetPaymentStatusControllerResponse = {
      id: paymentStatus.id,
      status: paymentStatus.status,
      date_approved: paymentStatus.date_approved,
      status_detail: paymentStatus.status_detail,
      transaction_amount: paymentStatus.transaction_amount,
      payer_email: paymentStatus.payer_email,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof CompanyNotFoundError) {
      return reply.status(400).send({
        message: error.message,
        name: error.name,
      })
    }

    if (error instanceof PaymentNotFoundError) {
      return reply.status(400).send({
        message: error.message,
        name: error.name,
      })
    }

    throw error
  }
}

export { getPaymentStatusController }
