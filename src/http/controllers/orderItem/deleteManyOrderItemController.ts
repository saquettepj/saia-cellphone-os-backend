import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleArrayOrderItemDTO } from '@/dtos/orderItems/ISimpleOrderItemDTO'
import { setupDeleteManyOrderItemUseCase } from '@/useCases/orderItem/factory/setupDeleteManyOrderItemUseCase'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'

interface IDeleteManyOrderItemControllerResponse {
  count: number
}

async function deleteManyOrderItemController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { ids } = ISimpleArrayOrderItemDTO.parse(request.body)

  try {
    const deleteManyOrderItemUseCase = setupDeleteManyOrderItemUseCase()

    const deleteManyOrderItemUseCaseReturn =
      await deleteManyOrderItemUseCase.execute({
        ids,
      })

    const responseBody: IDeleteManyOrderItemControllerResponse = {
      count: deleteManyOrderItemUseCaseReturn,
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

export { deleteManyOrderItemController }
