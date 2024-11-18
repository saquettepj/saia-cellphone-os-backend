import { FastifyReply, FastifyRequest } from 'fastify'

import { setupGetAccessTokenUseCase } from '@/useCases/accessToken/factory/setupGetAccessTokenUseCase'

interface IGetAccessTokenControllerResponse {
  accessTokens: {
    code: string
    companyId: string | null
    activatedAt: Date | null
  }[]
}

async function getAccessTokenController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getAccessTokenUseCase = setupGetAccessTokenUseCase()

    const getAccessTokenUseCaseReturn = await getAccessTokenUseCase.execute()

    const responseBody: IGetAccessTokenControllerResponse = {
      accessTokens: getAccessTokenUseCaseReturn.map((token) => ({
        code: token.code,
        companyId: token.companyId,
        activatedAt: token.activatedAt,
      })),
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getAccessTokenController }
