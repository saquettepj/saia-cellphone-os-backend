import { FastifyReply, FastifyRequest } from 'fastify'

import { setupCreateAccessTokenUseCase } from '@/useCases/accessToken/factory/setupCreateAccessTokenUseCase'
import { ICreateAccessTokenDTO } from '@/dtos/accessToken/ICreateAccessTokenDTO'
import { AnAccessTokenAlreadyHasCompanyIdError } from '@/errors/anAccessTokenAlreadyHasCompanyIdError'

interface ICreateAccessTokenControllerResponse {
  code: string
  companyId?: string | null
  activatedAt?: Date | null
}

async function createAccessTokenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { companyId } = ICreateAccessTokenDTO.parse(request.body)

  try {
    const createAccessTokenUseCase = setupCreateAccessTokenUseCase()

    const createAccessTokenUseCaseReturn =
      await createAccessTokenUseCase.execute({ companyId })

    const responseBody: ICreateAccessTokenControllerResponse = {
      code: createAccessTokenUseCaseReturn.code,
      companyId: createAccessTokenUseCaseReturn.companyId,
      activatedAt: createAccessTokenUseCaseReturn.activatedAt,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof AnAccessTokenAlreadyHasCompanyIdError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    throw error
  }
}

export { createAccessTokenController }
