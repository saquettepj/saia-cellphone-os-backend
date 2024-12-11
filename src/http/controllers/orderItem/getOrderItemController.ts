import { FastifyReply, FastifyRequest } from 'fastify'

import { IGetOrderItemDTO } from '@/dtos/orderItems/IGetOrderItemDTO'
import { setupGetOrderItemUseCase } from '@/useCases/orderItem/factory/setupGetOrderItemUseCase'

interface IGetOrderItemControllerResponse {
  orderItems: Array<{
    id: string
    orderId: string
    productId: string
    registeredProductPrice: number
    discount: number | null
    quantity: number
  }>
}

async function getOrderItemController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id, orderId, discount, productId, quantity } = IGetOrderItemDTO.parse(
    request.body,
  )

  try {
    const getOrderItemUseCase = setupGetOrderItemUseCase()

    const getOrderItemUseCaseReturn = await getOrderItemUseCase.execute({
      id,
      orderId,
      productId,
      discount,
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
