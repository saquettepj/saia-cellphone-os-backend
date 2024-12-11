import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleOrderDTO } from '@/dtos/order/ISimpleOrderDTO'
import { IUpdateOrderDTO } from '@/dtos/order/IUpdateOrderDTO'
import { setupUpdateOrderUseCase } from '@/useCases/order/factory/setupUpdateOrderUseCase'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'

interface IUpdateOrderControllerResponse {
  id: string
  number: number
  companyId: string
  clientId?: string | null
  employeeId?: string | null
  type: string
  status: string
  payDate: Date | null
  paymentMethod: string
  price: number
  description?: string | null
  paymentStatus: string
  closingDate: Date | null
  firstDueDate: Date | null
  dueDate: number | null
  numberOfInstallments: number | null
  interest: number | null
  orderItems?: Array<{
    id?: string
    productId?: string
    registeredProductPrice?: number
    quantity?: number
    initialQuantity?: number
    discount?: number | null
    service?: {
      id?: string
      employeeId?: string | null
    }
  }>
}

async function updateOrderController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = ISimpleOrderDTO.parse(request.params)

  const {
    IMEI,
    clientId,
    employeeId,
    type,
    status,
    payDate,
    paymentMethod,
    paymentStatus,
    firstDueDate,
    dueDate,
    numberOfInstallments,
    interest,
    description,
    orderItems,
  } = IUpdateOrderDTO.parse(request.body)

  try {
    const updateOrderUseCase = setupUpdateOrderUseCase()

    const updatedOrder = await updateOrderUseCase.execute({
      id,
      IMEI,
      clientId,
      employeeId,
      type,
      status,
      payDate,
      paymentMethod,
      paymentStatus,
      firstDueDate,
      dueDate,
      numberOfInstallments,
      interest,
      description,
      orderItems,
    })

    let responseBody: IUpdateOrderControllerResponse | undefined

    if (updatedOrder) {
      responseBody = {
        id: updatedOrder.id,
        companyId: updatedOrder.companyId,
        clientId: updatedOrder.clientId,
        employeeId: updatedOrder.employeeId,
        number: updatedOrder.number,
        type: updatedOrder.type,
        status: updatedOrder.status,
        payDate: updatedOrder.payDate,
        paymentMethod: updatedOrder.paymentMethod,
        price: updatedOrder.price,
        description: updatedOrder.description,
        paymentStatus: updatedOrder.paymentStatus,
        closingDate: updatedOrder.closingDate,
        firstDueDate: updatedOrder.firstDueDate,
        dueDate: updatedOrder.dueDate,
        numberOfInstallments: updatedOrder.numberOfInstallments,
        interest: updatedOrder.interest,
        orderItems: updatedOrder.orderItems?.map((item) => ({
          id: item.id,
          productId: item.productId,
          registeredProductPrice: item.registeredProductPrice,
          quantity: item.quantity,
          initialQuantity: item.initialQuantity,
          discount: item.discount,
          service: item?.service
            ? {
                id: item.service.id,
                employeeId: item.service.employeeId,
              }
            : undefined,
        })),
      }
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof EmployeeNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof ProductNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof OrderItemNotFoundError) {
      return reply
        .status(404)
        .send({ message: error.message, name: error.name })
    }
    if (error instanceof DuplicateOrderItemError) {
      return reply
        .status(400)
        .send({ message: error.message, name: error.name })
    }

    throw error
  }
}

export { updateOrderController }
