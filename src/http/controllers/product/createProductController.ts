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

  const { type, condition, description, price } = ICreateProductDTO.parse(
    request.body,
  )

  try {
    const createProductUseCase = setupCreateProductUseCase()

    const createProductUseCaseResult = await createProductUseCase.execute({
      companyId,
      type,
      condition,
      description,
      price,
    })

    const responseBody: ICreateProductControllerResponse = {
      id: createProductUseCaseResult.id,
      companyId: createProductUseCaseResult.companyId,
      type: createProductUseCaseResult.type,
      condition: createProductUseCaseResult.condition,
      description: createProductUseCaseResult.description,
      price: createProductUseCaseResult.price,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {}
}

export { createProductController }
