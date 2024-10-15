import { FastifyReply, FastifyRequest } from 'fastify'

import { IGetProductDTO } from '@/dtos/product/IGetProductDTO'
import { setupGetProductUseCase } from '@/useCases/product/factory/setupGetProductUseCase'

interface IGetProductControllerResponse {
  products: Array<{
    id: string
    companyId: string
    type: string
    condition: string
    description: string
    price: number
    quantity: number
  }>
}

async function getProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const { id, type, condition, description } = IGetProductDTO.parse(
    request.body,
  )

  try {
    const getProductUseCase = setupGetProductUseCase()

    const getProductUseCaseReturn = await getProductUseCase.execute({
      companyId,
      id,
      type,
      condition,
      description,
    })

    const responseBody: IGetProductControllerResponse = {
      products: getProductUseCaseReturn,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getProductController }
