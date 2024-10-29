import { FastifyReply, FastifyRequest } from 'fastify'

import { setupCreateOrderItemUseCase } from '@/useCases/orderItem/factory/setupCreateOrderItemUseCase'
import { ICreateOrderItemDTO } from '@/dtos/orderItems/ICreateOrderItemDTO'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'

interface ICreateOrderItemControllerResponse {
  id: string
  orderId: string
  productId: string
  quantity: number
}

async function createOrderItemController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { orderId, productId, quantity } = ICreateOrderItemDTO.parse(
    request.body,
  )

  try {
    const createOrderItemUseCase = setupCreateOrderItemUseCase()

    const createOrderItemUseCaseReturn = await createOrderItemUseCase.execute({
      orderId,
      productId,
      quantity,
    })

    const responseBody: ICreateOrderItemControllerResponse = {
      id: createOrderItemUseCaseReturn.id,
      orderId: createOrderItemUseCaseReturn.orderId,
      productId: createOrderItemUseCaseReturn.productId,
      quantity: createOrderItemUseCaseReturn.quantity,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof DuplicateOrderItemError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}

export { createOrderItemController }
