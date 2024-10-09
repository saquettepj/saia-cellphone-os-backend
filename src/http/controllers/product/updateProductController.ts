import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleProductDTO } from '@/dtos/product/ISimpleProductDTO'
import { IUpdateProductDTO } from '@/dtos/product/IUpdateProductDTO'
import { setupUpdateProductUseCase } from '@/useCases/product/factory/setupUpdateProductUseCase'

interface IUpdateProductControllerResponse {
  id: string
  companyId: string
  manufactureBy: string
  model: string
  condition: string
  description?: string | null
}

async function updateProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleProductDTO.parse(request.params)

  const { manufactureBy, model, condition, description } =
    IUpdateProductDTO.parse(request.body)

  try {
    const updateProductUseCase = setupUpdateProductUseCase()

    const updateProductUseCaseResult = await updateProductUseCase.execute({
      id,
      manufactureBy,
      model,
      condition,
      description,
    })

    const responseBody: IUpdateProductControllerResponse = {
      id: updateProductUseCaseResult.id,
      companyId: updateProductUseCaseResult.companyId,
      manufactureBy: updateProductUseCaseResult.manufactureBy,
      model: updateProductUseCaseResult.model,
      condition: updateProductUseCaseResult.condition,
      description: updateProductUseCaseResult.description,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {}
}

export { updateProductController }
