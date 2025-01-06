/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreatePaymentDTO } from '@/dtos/payment/ICreatePaymentDTO'
import { setupCreatePaymentUseCase } from '@/useCases/payment/factory/setupCreatePaymentUseCase'
import { PaymentError } from '@/errors/paymentError'

interface ICreatePaymentControllerResponse {
  id?: number
  status?: string
  statusDetail?: string
  transactionAmount?: number
  description?: string
  payerEmail?: string
}

async function createPaymentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { transaction_amount, payment_method_id, payer } =
    ICreatePaymentDTO.parse(request.body)

  try {
    const createPaymentUseCase = setupCreatePaymentUseCase()

    const createPaymentUseCaseReturn = await createPaymentUseCase.execute({
      transaction_amount,
      payment_method_id,
      payer,
    })

    const responseBody: ICreatePaymentControllerResponse = {
      id: createPaymentUseCaseReturn?.id,
      status: createPaymentUseCaseReturn?.status,
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
