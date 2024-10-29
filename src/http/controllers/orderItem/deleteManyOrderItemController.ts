import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleArrayOrderItemDTO } from '@/dtos/orderItems/ISimpleOrderItemDTO'
import { setupDeleteManyOrderItemUseCase } from '@/useCases/orderItem/factory/setupDeleteManyOrderItemUseCase'

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
    throw error
  }
}

export { deleteManyOrderItemController }
