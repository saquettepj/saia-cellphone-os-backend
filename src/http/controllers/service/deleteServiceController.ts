import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleServiceDTO } from '@/dtos/service/ISimpleServiceDTO'
import { setupDeleteServiceUseCase } from '@/useCases/service/factory/setupDeleteServiceUseCase'

interface IDeleteServiceControllerResponse {
  id: string
}

async function deleteServiceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleServiceDTO.parse(request.params)

  try {
    const deleteServiceUseCase = setupDeleteServiceUseCase()

    const deleteServiceUseCaseReturn = await deleteServiceUseCase.execute({
      id,
    })

    const responseBody: IDeleteServiceControllerResponse = {
      id: deleteServiceUseCaseReturn.id,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { deleteServiceController }
