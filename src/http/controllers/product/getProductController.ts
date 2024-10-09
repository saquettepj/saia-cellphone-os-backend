import { FastifyReply, FastifyRequest } from 'fastify'
import { Product } from '@prisma/client'

import { IGetProductDTO } from '@/dtos/product/IGetProductDTO'
import { setupGetProductUseCase } from '@/useCases/product/factory/setupGetProductUseCase'

interface IGetProductControllerResponse {
  products: Product[]
}

async function getProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { id, manufactureBy, model, condition, description } =
    IGetProductDTO.parse(request.body)

  try {
    const getProductUseCase = setupGetProductUseCase()

    const getProductUseCaseResult = await getProductUseCase.execute({
      companyId,
      id,
      manufactureBy,
      model,
      condition,
      description,
    })

    const responseBody: IGetProductControllerResponse = {
      products: getProductUseCaseResult,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {}
}

export { getProductController }
