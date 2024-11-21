import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleOrderItemDTO } from '@/dtos/orderItems/ISimpleOrderItemDTO'
import { setupDeleteOrderItemUseCase } from '@/useCases/orderItem/factory/setupDeleteOrderItemUseCase'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'

interface IDeleteOrderItemControllerResponse {
  id: string
}

async function deleteOrderItemController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleOrderItemDTO.parse(request.params)

  try {
    const deleteOrderItemUseCase = setupDeleteOrderItemUseCase()

    const deleteOrderItemUseCaseReturn = await deleteOrderItemUseCase.execute({
      id,
    })

    const responseBody: IDeleteOrderItemControllerResponse = {
      id: deleteOrderItemUseCaseReturn.id,
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

export { deleteOrderItemController }
