import { FastifyReply, FastifyRequest } from 'fastify'

import { SystemConfigNotFoundError } from '@/errors/systemConfigNotFoundError'
import { setupGetSystemConfigUseCase } from '@/useCases/systemConfig/factory/setupGetSystemConfigUseCase'

interface IGetSystemConfigControllerResponse {
  terms: string
  termsUpdateAt: Date
  updatedAt: Date
}

async function getSystemConfigController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getSystemConfigUseCase = setupGetSystemConfigUseCase()

    const systemConfig = await getSystemConfigUseCase.execute()

    const responseBody: IGetSystemConfigControllerResponse = {
      terms: systemConfig.terms,
      termsUpdateAt: systemConfig.termsUpdateAt,
      updatedAt: systemConfig.updatedAt,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof SystemConfigNotFoundError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { getSystemConfigController }
