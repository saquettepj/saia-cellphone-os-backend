import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleProductDTO } from '@/dtos/product/ISimpleProductDTO'
import { setupDeleteProductUseCase } from '@/useCases/product/factory/setupDeleteProductUseCase'

interface IProductControllerResponse {
  id: string
}

async function deleteProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleProductDTO.parse(request.params)

  try {
    const deleteProductUseCase = setupDeleteProductUseCase()

    const deleteProductUseCaseReturn = await deleteProductUseCase.execute({
      id,
    })

    const responseBody: IProductControllerResponse = {
      id: deleteProductUseCaseReturn.id,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {}
}

export { deleteProductController }
