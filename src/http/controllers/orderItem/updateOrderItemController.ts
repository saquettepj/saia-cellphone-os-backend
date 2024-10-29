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
  quantity: number
}

async function updateOrderItemController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleOrderItemDTO.parse(request.params)
  const { quantity } = IUpdateOrderItemDTO.parse(request.body)

  try {
    const updateOrderItemUseCase = setupUpdateOrderItemUseCase()

    const updateOrderItemUseCaseReturn = await updateOrderItemUseCase.execute({
      id,
      quantity,
    })

    const responseBody: IUpdateOrderItemControllerResponse = {
      id: updateOrderItemUseCaseReturn.id,
      orderId: updateOrderItemUseCaseReturn.orderId,
      productId: updateOrderItemUseCaseReturn.productId,
      quantity: updateOrderItemUseCaseReturn.quantity,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof OrderItemNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof ProductNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}

export { updateOrderItemController }
