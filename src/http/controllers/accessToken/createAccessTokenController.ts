import { FastifyReply, FastifyRequest } from 'fastify'

import { setupCreateAccessTokenUseCase } from '@/useCases/accessToken/factory/setupCreateAccessTokenUseCase'
import { ICreateAccessTokenDTO } from '@/dtos/accessToken/ICreateAccessTokenDTO'

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
    throw error
  }
}

export { createAccessTokenController }
