/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from 'fastify'

import { IGetIPNPaymentNotificationDTO } from '@/dtos/payment/IGetIPNPaymentNotificationDTO'
import { setupGetIPNPaymentNotificationUseCase } from '@/useCases/payment/factory/setupGetIPNPaymentNotificationUseCase'
import { PaymentNotificationError } from '@/errors/paymentNotificationError'

interface IGetIPNPaymentNotificationControllerResponse {
  statusSuccess: boolean
}

async function getIPNPaymentNotificationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = IGetIPNPaymentNotificationDTO.parse(request.body)

  try {
    const getIPNPaymentNotificationUseCase =
      setupGetIPNPaymentNotificationUseCase()

    await getIPNPaymentNotificationUseCase.execute({ id })

    const responseBody: IGetIPNPaymentNotificationControllerResponse = {
      statusSuccess: true,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof PaymentNotificationError) {
      return reply.status(400).send({
        statusSuccess: false,
        message: error.message,
        name: error.name,
      })
    }

    throw error
  }
}

export { getIPNPaymentNotificationController }
