import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleOrderDTO } from '@/dtos/order/ISimpleOrderDTO'
import { DeletingError } from '@/errors/deletingError'
import { setupDeleteOrderUseCase } from '@/useCases/order/factory/setupDeleteOrderUseCase'
import { DeleteDateNotAllowed } from '@/errors/deleteDateNotAllowed'

interface IDeleteOrderControllerResponse {
  id: string
}

async function deleteOrderController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleOrderDTO.parse(request.params)

  try {
    const deleteOrderUseCase = setupDeleteOrderUseCase()
    const deleteOrderUseCaseReturn = await deleteOrderUseCase.execute({ id })

    const responseBody: IDeleteOrderControllerResponse = {
      id: deleteOrderUseCaseReturn.id,
    }
    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof DeletingError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof DeleteDateNotAllowed) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    throw error
  }
}

export { deleteOrderController }
