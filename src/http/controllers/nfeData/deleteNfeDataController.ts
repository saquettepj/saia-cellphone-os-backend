import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleNfeDataDTO } from '@/dtos/nfeData/ISimpleNfeDataDTO'
import { setupDeleteNfeDataUseCase } from '@/useCases/nfeData/factory/setupDeleteNfeDataUseCase.ts'

interface IDeleteNfeDataControllerResponse {
  id: string
}

async function deleteNfeDataController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleNfeDataDTO.parse(request.params)

  try {
    const deleteNfeDataUseCase = setupDeleteNfeDataUseCase()

    const deleteNfeDataUseCaseReturn = await deleteNfeDataUseCase.execute({
      id,
    })

    const responseBody: IDeleteNfeDataControllerResponse = {
      id: deleteNfeDataUseCaseReturn.id,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { deleteNfeDataController }
