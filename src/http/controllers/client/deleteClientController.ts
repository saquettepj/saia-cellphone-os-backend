import { FastifyReply, FastifyRequest } from 'fastify'

import { setupDeleteClientUseCase } from '@/useCases/client/factory/setupDeleteClientUseCase'
import { ISimpleClientDTO } from '@/dtos/client/ISimpleClientDTO'

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
    throw error
  }
}

export { deleteClientController }
