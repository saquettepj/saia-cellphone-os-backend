import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateProductDTO } from '@/dtos/product/ICreateProductDTO'
import { setupCreateProductUseCase } from '@/useCases/product/factory/setupCreateProductUseCase'

interface ICreateProductControllerResponse {
  id: string
  companyId: string
  manufactureBy: string
  model: string
  condition: string
  description?: string | null
}

async function createProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { manufactureBy, model, condition, description } =
    ICreateProductDTO.parse(request.body)

  try {
    const createProductUseCase = setupCreateProductUseCase()

    const createProductUseCaseResult = await createProductUseCase.execute({
      companyId,
      manufactureBy,
      model,
      condition,
      description,
    })

    const responseBody: ICreateProductControllerResponse = {
      id: createProductUseCaseResult.id,
      companyId: createProductUseCaseResult.companyId,
      manufactureBy: createProductUseCaseResult.manufactureBy,
      model: createProductUseCaseResult.model,
      condition: createProductUseCaseResult.condition,
      description: createProductUseCaseResult.description,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {}
}

export { createProductController }
