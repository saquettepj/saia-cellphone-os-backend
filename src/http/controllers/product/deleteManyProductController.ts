import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleArrayProductDTO } from '@/dtos/product/ISimpleProductDTO'
import { setupDeleteManyProductUseCase } from '@/useCases/product/factory/setupDeleteManyProductUseCase'

interface IProductControllerResponse {
  count: number
}

async function deleteManyProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { ids } = ISimpleArrayProductDTO.parse(request.body)

  try {
    const deleteManyProductUseCase = setupDeleteManyProductUseCase()

    const deleteManyProductUseCaseReturn =
      await deleteManyProductUseCase.execute({
        ids,
      })

    const responseBody: IProductControllerResponse = {
      count: deleteManyProductUseCaseReturn,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { deleteManyProductController }
