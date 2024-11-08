import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateAccessTokenDTO } from '@/dtos/accessToken/IUpdateAccessTokenDTO'
import { AccessTokenNotFoundError } from '@/errors/accessTokenNotFoundError'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { setupUpdateAccessTokenUseCase } from '@/useCases/accessToken/factory/setupUpdateAccessTokenUseCase'
import { AnAccessTokenAlreadyHasCompanyIdError } from '@/errors/anAccessTokenAlreadyHasCompanyIdError'
import { ThisAccessTokenAlreadyHasCompanyIdError } from '@/errors/thisAccessTokenAlreadyHasCompanyIdError'

async function updateAccessTokenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string }
  const { companyId } = IUpdateAccessTokenDTO.parse(request.body)

  try {
    const updateAccessTokenUseCase = setupUpdateAccessTokenUseCase()
    await updateAccessTokenUseCase.execute({ id, companyId })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof AccessTokenNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof AnAccessTokenAlreadyHasCompanyIdError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof ThisAccessTokenAlreadyHasCompanyIdError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof CompanyNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

export { updateAccessTokenController }
