import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleOrderDTO } from '@/dtos/order/ISimpleOrderDTO'
import { IUpdateOrderDTO } from '@/dtos/order/IUpdateOrderDTO'
import { setupUpdateOrderUseCase } from '@/useCases/order/factory/setupUpdateOrderUseCase'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

interface IUpdateOrderControllerResponse {
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
}

async function updateOrderController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company
  const { id } = ISimpleOrderDTO.parse(request.params)
  const {
    clientId,
    employeeId,
    number,
    type,
    status,
    payDate,
    paymentMethod,
    price,
    description,
  } = IUpdateOrderDTO.parse(request.body)

  try {
    const updateOrderUseCase = setupUpdateOrderUseCase()
    const updatedOrder = await updateOrderUseCase.execute({
      id,
      companyId,
      clientId,
      employeeId,
      number,
      type,
      status,
      payDate,
      paymentMethod,
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
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof EmployeeNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}

export { updateOrderController }
