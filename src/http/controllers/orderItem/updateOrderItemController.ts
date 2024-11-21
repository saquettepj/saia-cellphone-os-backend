import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleOrderItemDTO } from '@/dtos/orderItems/ISimpleOrderItemDTO'
import { IUpdateOrderItemDTO } from '@/dtos/orderItems/IUpdateOrderItemDTO'
import { setupUpdateOrderItemUseCase } from '@/useCases/orderItem/factory/setupUpdateOrderItemUseCase'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'

interface IUpdateOrderItemControllerResponse {
  id: string
  orderId: string
  productId: string
  discount: number | null
  quantity: number
}

async function updateOrderItemController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleOrderItemDTO.parse(request.params)
  const { quantity, discount } = IUpdateOrderItemDTO.parse(request.body)

  try {
    const updateOrderItemUseCase = setupUpdateOrderItemUseCase()

    const updateOrderItemUseCaseReturn = await updateOrderItemUseCase.execute({
      id,
      quantity,
      discount,
    })

    const responseBody: IUpdateOrderItemControllerResponse = {
      id: updateOrderItemUseCaseReturn.id,
      orderId: updateOrderItemUseCaseReturn.orderId,
      productId: updateOrderItemUseCaseReturn.productId,
      discount: updateOrderItemUseCaseReturn.discount,
      quantity: updateOrderItemUseCaseReturn.quantity,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof OrderItemNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof ProductNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    throw error
  }
}

export { updateOrderItemController }
