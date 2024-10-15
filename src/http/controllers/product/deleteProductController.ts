import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleProductDTO } from '@/dtos/product/ISimpleProductDTO'
import { setupDeleteProductUseCase } from '@/useCases/product/factory/setupDeleteProductUseCase'

interface IDeleteProductControllerResponse {
  id: string
}

async function deleteProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleProductDTO.parse(request.params)

  try {
    const deleteProductUseCase = setupDeleteProductUseCase()

    const deleteProductUseCaseResult = await deleteProductUseCase.execute({
      id,
    })

    const responseBody: IDeleteProductControllerResponse = {
      id: deleteProductUseCaseResult.id,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { deleteProductController }
