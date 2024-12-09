import { FastifyReply, FastifyRequest } from 'fastify'

import { ICreateOrderDTO } from '@/dtos/order/ICreateOrderDTO'
import { setupCreateOrderUseCase } from '@/useCases/order/factory/setupCreateOrderUseCase'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

interface ICreateOrderControllerResponse {
  id: string
  companyId: string
  clientId?: string | null
  employeeId?: string | null
  number: number
  type: string
  status: string
  payDate: Date | null
  paymentMethod: string
  paymentStatus: string
  closingDate: Date | null
  firstDueDate: Date | null
  dueDate: number | null
  numberOfInstallments: number | null
  interest: number | null
  price: number
  description?: string | null
  createdAt: Date
  orderItems?: Array<{
    id: string
    productId: string
    quantity: number
    initialQuantity: number
    discount?: number | null
    service?: {
      id: string
      orderItemId?: string | null
      employeeId?: string | null
      status?: string | null
      report?: string | null
    }
  }>
}

async function createOrderController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

  const {
    IMEI,
    clientId,
    employeeId,
    status,
    payDate,
    paymentMethod,
    paymentStatus,
    price,
    description,
    firstDueDate,
    dueDate,
    numberOfInstallments,
    interest,
    orderItems,
    type,
  } = ICreateOrderDTO.parse(request.body)

  try {
    const createOrderUseCase = setupCreateOrderUseCase()

    const createOrderUseCaseReturn = await createOrderUseCase.execute({
      companyId,
      IMEI,
      clientId,
      employeeId,
      status,
      payDate,
      paymentMethod,
      paymentStatus,
      price,
      description,
      firstDueDate,
      dueDate,
      numberOfInstallments,
      interest,
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
      paymentStatus: createOrderUseCaseReturn.paymentStatus,
      closingDate: createOrderUseCaseReturn.closingDate,
      firstDueDate: createOrderUseCaseReturn.firstDueDate,
      dueDate: createOrderUseCaseReturn.dueDate,
      numberOfInstallments: createOrderUseCaseReturn.numberOfInstallments,
      interest: createOrderUseCaseReturn.interest,
      price: createOrderUseCaseReturn.price,
      description: createOrderUseCaseReturn.description,
      createdAt: createOrderUseCaseReturn.createdAt,
      orderItems: createOrderUseCaseReturn.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        initialQuantity: item.initialQuantity,
        discount: item?.discount,
        service: item?.service
          ? {
              id: item.service.id,
              employeeId: item?.service?.employeeId,
            }
          : undefined,
      })),
    }

    return reply.status(201).send(responseBody)
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return reply
        .status(404)
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

export { createOrderController }
