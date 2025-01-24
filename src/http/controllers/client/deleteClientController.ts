import { FastifyReply, FastifyRequest } from 'fastify'

import { setupDeleteClientUseCase } from '@/useCases/client/factory/setupDeleteClientUseCase'
import { ISimpleClientDTO } from '@/dtos/client/ISimpleClientDTO'
import { DeleteDateNotAllowed } from '@/errors/deleteDateNotAllowed'

async function deleteClientController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleClientDTO.parse(request.params)

  try {
    const deleteClientUseCase = setupDeleteClientUseCase()
    await deleteClientUseCase.execute({ id })

    return reply.status(200).send({ id })
  } catch (error) {
    if (error instanceof DeleteDateNotAllowed) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    throw error
  }
}

export { deleteClientController }
