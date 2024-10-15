import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleProductDTO } from '@/dtos/product/ISimpleProductDTO'
import { IUpdateProductDTO } from '@/dtos/product/IUpdateProductDTO'
import { setupUpdateProductUseCase } from '@/useCases/product/factory/setupUpdateProductUseCase'

interface IUpdateProductControllerResponse {
  id: string
  companyId: string
  type: string
  condition: string
  description: string | null
  price: number
  quantity: number
}

async function updateProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleProductDTO.parse(request.params)

  const { type, condition, description, price, quantity } =
    IUpdateProductDTO.parse(request.body)

  try {
    const updateProductUseCase = setupUpdateProductUseCase()

    const updateProductUseCaseReturn = await updateProductUseCase.execute({
      id,
      type,
      condition,
      description,
      price,
      quantity,
    })

    const responseBody: IUpdateProductControllerResponse = {
      id: updateProductUseCaseReturn.id,
      companyId: updateProductUseCaseReturn.companyId,
      type: updateProductUseCaseReturn.type,
      condition: updateProductUseCaseReturn.condition,
      description: updateProductUseCaseReturn.description,
      price: updateProductUseCaseReturn.price,
      quantity: updateProductUseCaseReturn.quantity,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { updateProductController }
