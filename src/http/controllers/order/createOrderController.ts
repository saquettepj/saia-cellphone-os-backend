import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateOrderDTO } from '@/dtos/order/ICreateOrderDTO'
import { setupCreateOrderUseCase } from '@/useCases/order/factory/setupCreateOrderUseCase'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'

interface ICreateOrderControllerResponse {
  id: string
  companyId: string
  clientId: string
  employeeId: string
  number: number
  type: string
  status: string
  payDate: Date
  paymentMethod: string
  price: number
  description?: string | null
  orderItems?: Array<{
    productId: string
    quantity: number
  }>
}

async function createOrderController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company
  const {
    clientId,
    employeeId,
    number,
    status,
    payDate,
    paymentMethod,
    price,
    description,
    orderItems,
    type,
  } = ICreateOrderDTO.parse(request.body)

  try {
    const createOrderUseCase = setupCreateOrderUseCase()

    const createOrderUseCaseReturn = await createOrderUseCase.execute({
      companyId,
      clientId,
      employeeId,
      number,
      status,
      payDate,
      paymentMethod,
      price,
      description,
      orderItems,
      type,
    })

    const responseBody: ICreateOrderControllerResponse = {
      id: createOrderUseCaseReturn.id,
      companyId: createOrderUseCaseReturn.companyId,
      clientId: createOrderUseCaseReturn.clientId,
      employeeId: createOrderUseCaseReturn.employeeId,
      number: createOrderUseCaseReturn.number,
      type: createOrderUseCaseReturn.type,
      status: createOrderUseCaseReturn.status,
      payDate: createOrderUseCaseReturn.payDate,
      paymentMethod: createOrderUseCaseReturn.paymentMethod,
      price: createOrderUseCaseReturn.price,
      description: createOrderUseCaseReturn.description,
      orderItems: createOrderUseCaseReturn.orderItems.map((item) => ({
        productId: item?.productId,
        quantity: item?.quantity,
      })),
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof DuplicateOrderItemError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof ProductNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}

export { createOrderController }
