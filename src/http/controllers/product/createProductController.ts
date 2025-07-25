import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateProductDTO } from '@/dtos/product/ICreateProductDTO'
import { setupCreateProductUseCase } from '@/useCases/product/factory/setupCreateProductUseCase'
import { ProductDescriptionAlreadyExistsError } from '@/errors/productDescriptionAlreadyExistsError'
import { SupplierNotFoundError } from '@/errors/supplierNotFoundError'

interface ICreateProductControllerResponse {
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

async function createProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

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
  } = ICreateProductDTO.parse(request.body)

  try {
    const createProductUseCase = setupCreateProductUseCase()

    const createProductUseCaseReturn = await createProductUseCase.execute({
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

    const responseBody: ICreateProductControllerResponse = {
      id: createProductUseCaseReturn.id,
      companyId: createProductUseCaseReturn.companyId,
      type: createProductUseCaseReturn.type,
      condition: createProductUseCaseReturn.condition,
      description: createProductUseCaseReturn.description,
      price: createProductUseCaseReturn.price,
      cost: createProductUseCaseReturn.cost,
      quantity: createProductUseCaseReturn.quantity,
      warrantyDays: createProductUseCaseReturn.warrantyDays,
      localization: createProductUseCaseReturn.localization,
      supplierId: createProductUseCaseReturn.supplierId,
      NCM: createProductUseCaseReturn.NCM,
      cEAN: createProductUseCaseReturn.cEAN,
    }

    return reply.status(201).send(responseBody)
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

export { createProductController }
