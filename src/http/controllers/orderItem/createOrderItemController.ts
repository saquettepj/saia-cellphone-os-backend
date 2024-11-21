import { FastifyReply, FastifyRequest } from 'fastify'

import { setupCreateOrderItemUseCase } from '@/useCases/orderItem/factory/setupCreateOrderItemUseCase'
import { ICreateOrderItemDTO } from '@/dtos/orderItems/ICreateOrderItemDTO'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

interface ICreateOrderItemControllerResponse {
  id: string
  orderId: string
  productId: string
  quantity: number
  initialQuantity: number
  discount?: number | null
  service?: {
    employeeId: string | null
  }
}

async function createOrderItemController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { orderId, productId, quantity, discount, service } =
    ICreateOrderItemDTO.parse(request.body)

  try {
    const createOrderItemUseCase = setupCreateOrderItemUseCase()

    const createOrderItemUseCaseReturn = await createOrderItemUseCase.execute({
      orderId,
      productId,
      quantity,
      discount,
      service,
    })

    const responseBody: ICreateOrderItemControllerResponse = {
      id: createOrderItemUseCaseReturn.id,
      orderId: createOrderItemUseCaseReturn.orderId,
      productId: createOrderItemUseCaseReturn.productId,
      quantity: createOrderItemUseCaseReturn.quantity,
      initialQuantity: createOrderItemUseCaseReturn.initialQuantity,
      discount: createOrderItemUseCaseReturn.discount,
      service: createOrderItemUseCaseReturn.service
        ? {
            employeeId: createOrderItemUseCaseReturn.service.employeeId,
          }
        : undefined,
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    if (error instanceof DuplicateOrderItemError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    if (error instanceof EmployeeNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { createOrderItemController }
