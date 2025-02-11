import { FastifyReply, FastifyRequest } from 'fastify'

import { IUpdateSystemConfigDTO } from '@/dtos/systemConfig/IUpdateSystemConfigDTO'
import { UpdatingError } from '@/errors/updatingError'
import { setupUpdateSystemConfigUseCase } from '@/useCases/systemConfig/factory/setupUpdateSystemConfigUseCase'

interface IUpdateSystemConfigControllerResponse {
  terms: string
  termsUpdateAt: Date
  subscriptionAgreement: string
  updatedAt: Date
}

async function updateSystemConfigController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { terms, password, subscriptionAgreement } =
    IUpdateSystemConfigDTO.parse(request.body)

  try {
    const updateSystemConfigUseCase = setupUpdateSystemConfigUseCase()

    const updateSystemConfigUseCaseReturn =
      await updateSystemConfigUseCase.execute({
        terms,
        subscriptionAgreement,
        password,
      })

    const responseBody: IUpdateSystemConfigControllerResponse = {
      terms: updateSystemConfigUseCaseReturn.terms,
      termsUpdateAt: updateSystemConfigUseCaseReturn.termsUpdateAt,
      subscriptionAgreement:
        updateSystemConfigUseCaseReturn.subscriptionAgreement,
      updatedAt: updateSystemConfigUseCaseReturn.updatedAt,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof UpdatingError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { updateSystemConfigController }
