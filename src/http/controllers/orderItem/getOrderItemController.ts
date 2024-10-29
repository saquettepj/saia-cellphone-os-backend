import { FastifyReply, FastifyRequest } from 'fastify'

import { IGetOrderItemDTO } from '@/dtos/orderItems/IGetOrderItemDTO'
import { setupGetOrderItemUseCase } from '@/useCases/orderItem/factory/setupGetOrderItemUseCase'

interface IGetOrderItemControllerResponse {
  orderItems: Array<{
    id: string
    orderId: string
    productId: string
    quantity: number
  }>
}

async function getOrderItemController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id, orderId, productId, quantity } = IGetOrderItemDTO.parse(
    request.body,
  )

  try {
    const getOrderItemUseCase = setupGetOrderItemUseCase()

    const getOrderItemUseCaseReturn = await getOrderItemUseCase.execute({
      id,
      orderId,
      productId,
      quantity,
    })

    const responseBody: IGetOrderItemControllerResponse = {
      orderItems: getOrderItemUseCaseReturn,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getOrderItemController }
