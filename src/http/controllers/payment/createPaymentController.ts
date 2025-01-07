/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreatePaymentDTO } from '@/dtos/payment/ICreatePaymentDTO'
import { setupCreatePaymentUseCase } from '@/useCases/payment/factory/setupCreatePaymentUseCase'
import { PaymentError } from '@/errors/paymentError'

interface ICreatePaymentControllerResponse {
  id?: number
  status?: string
  date_approved?: string | Date
  statusDetail?: string
  transactionAmount?: number
  description?: string
  payerEmail?: string
}

async function createPaymentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const paymentData = ICreatePaymentDTO.parse(request.body)

  try {
    const createPaymentUseCase = setupCreatePaymentUseCase()

    const createPaymentUseCaseReturn = await createPaymentUseCase.execute({
      companyId,
      paymentCreateData: {
        ...paymentData,
        issuer_id: Number(paymentData.issuer_id),
      },
    })

    const responseBody: ICreatePaymentControllerResponse = {
      id: createPaymentUseCaseReturn?.id,
      status: createPaymentUseCaseReturn?.status,
      date_approved: createPaymentUseCaseReturn?.date_approved,
      statusDetail: createPaymentUseCaseReturn?.status_detail,
      transactionAmount: createPaymentUseCaseReturn?.transaction_amount,
      description: createPaymentUseCaseReturn?.description,
      payerEmail: createPaymentUseCaseReturn?.payer?.email,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof PaymentError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { createPaymentController }
