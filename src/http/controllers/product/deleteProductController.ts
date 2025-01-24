import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleProductDTO } from '@/dtos/product/ISimpleProductDTO'
import { setupDeleteProductUseCase } from '@/useCases/product/factory/setupDeleteProductUseCase'
import { DeleteDateNotAllowed } from '@/errors/deleteDateNotAllowed'

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

    const deleteProductUseCaseReturn = await deleteProductUseCase.execute({
      id,
    })

    const responseBody: IDeleteProductControllerResponse = {
      id: deleteProductUseCaseReturn.id,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof DeleteDateNotAllowed) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    throw error
  }
}

export { deleteProductController }
