import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleOrderDTO } from '@/dtos/order/ISimpleOrderDTO'
import { DeletingError } from '@/errors/deletingError'
import { setupDeleteOrderUseCase } from '@/useCases/order/factory/setupDeleteOrderUseCase'

async function deleteOrderController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleOrderDTO.parse(request.params)

  try {
    const deleteOrderUseCase = setupDeleteOrderUseCase()
    await deleteOrderUseCase.execute({ id })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof DeletingError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}

export { deleteOrderController }
