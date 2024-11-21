import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleOrderDTO } from '@/dtos/order/ISimpleOrderDTO'
import { IUpdateOrderDTO } from '@/dtos/order/IUpdateOrderDTO'
import { setupUpdateOrderUseCase } from '@/useCases/order/factory/setupUpdateOrderUseCase'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

interface IUpdateOrderControllerResponse {
  id: string
  number: number
  companyId: string
  clientId: string
  employeeId: string
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
    price,
    description,
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
      price,
      description,
    })

    const responseBody: IUpdateOrderControllerResponse = {
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
    throw error
  }
}

export { updateOrderController }
