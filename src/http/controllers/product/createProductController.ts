import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateProductDTO } from '@/dtos/product/ICreateProductDTO'
import { setupCreateProductUseCase } from '@/useCases/product/factory/setupCreateProductUseCase'

interface ICreateProductControllerResponse {
  id: string
  companyId: string
  type: string
  condition: string
  description: string
  price: number
}

async function createProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { type, condition, description, price, quantity } =
    ICreateProductDTO.parse(request.body)

  try {
    const createProductUseCase = setupCreateProductUseCase()

    const createProductUseCaseReturn = await createProductUseCase.execute({
      companyId,
      type,
      condition,
      description,
      price,
      quantity,
    })

    const responseBody: ICreateProductControllerResponse = {
      id: createProductUseCaseReturn.id,
      companyId: createProductUseCaseReturn.companyId,
      type: createProductUseCaseReturn.type,
      condition: createProductUseCaseReturn.condition,
      description: createProductUseCaseReturn.description,
      price: createProductUseCaseReturn.price,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { createProductController }
