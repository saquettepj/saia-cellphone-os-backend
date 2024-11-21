import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleAccessTokenDTO } from '@/dtos/accessToken/ISimpleAccessTokenDTO'
import { DeletingError } from '@/errors/deletingError'
import { setupDeleteAccessTokenUseCase } from '@/useCases/accessToken/factory/setupDeleteAccessTokenUseCase'

async function deleteAccessTokenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleAccessTokenDTO.parse(request.params)

  try {
    const deleteAccessTokenUseCase = setupDeleteAccessTokenUseCase()

    await deleteAccessTokenUseCase.execute({ id })
    return reply.status(204).send()
  } catch (error) {
    if (error instanceof DeletingError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { deleteAccessTokenController }
