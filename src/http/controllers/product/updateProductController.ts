import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleProductDTO } from '@/dtos/product/ISimpleProductDTO'
import { IUpdateProductDTO } from '@/dtos/product/IUpdateProductDTO'
import { setupUpdateProductUseCase } from '@/useCases/product/factory/setupUpdateProductUseCase'
import { ProductDescriptionAlreadyExistsError } from '@/errors/productDescriptionAlreadyExistsError'
import { SupplierNotFoundError } from '@/errors/supplierNotFoundError'

interface IUpdateProductControllerResponse {
  id: string
  companyId: string
  type: string
  condition: string
  description: string
  price: number
  cost: number
  quantity: number
  warrantyDays?: number | null
  localization?: string | null
  supplierId?: string | null
  NCM?: string | null
  cEAN?: string | null
}

async function updateProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company
  const { id } = ISimpleProductDTO.parse(request.params)

  const {
    type,
    condition,
    description,
    price,
    cost,
    quantity,
    warrantyDays,
    localization,
    supplierId,
    NCM,
    cEAN,
  } = IUpdateProductDTO.parse(request.body)

  try {
    const updateProductUseCase = setupUpdateProductUseCase()

    const updateProductUseCaseReturn = await updateProductUseCase.execute({
      id,
      companyId,
      type,
      condition,
      description,
      price,
      cost,
      quantity,
      warrantyDays,
      localization,
      supplierId,
      NCM,
      cEAN,
    })

    const responseBody: IUpdateProductControllerResponse = {
      id: updateProductUseCaseReturn.id,
      companyId: updateProductUseCaseReturn.companyId,
      type: updateProductUseCaseReturn.type,
      condition: updateProductUseCaseReturn.condition,
      description: updateProductUseCaseReturn.description,
      price: updateProductUseCaseReturn.price,
      cost: updateProductUseCaseReturn.cost,
      quantity: updateProductUseCaseReturn.quantity,
      warrantyDays: updateProductUseCaseReturn.warrantyDays,
      localization: updateProductUseCaseReturn.localization,
      supplierId: updateProductUseCaseReturn.supplierId,
      NCM: updateProductUseCaseReturn.NCM,
      cEAN: updateProductUseCaseReturn.cEAN,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof ProductDescriptionAlreadyExistsError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof SupplierNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    throw error
  }
}

export { updateProductController }
