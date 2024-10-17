import { FastifyReply, FastifyRequest } from 'fastify'

import { IGetOrderDTO } from '@/dtos/order/IGetOrderDTO'
import { setupGetOrderUseCase } from '@/useCases/order/factory/setupGetOrderUseCase'

interface IGetOrderControllerResponse {
  orders: Array<{
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
  }>
}

async function getOrderController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: companyId } = request.company

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
    orderItems,
  } = IGetOrderDTO.parse(request.body)

  try {
    const getOrderUseCase = setupGetOrderUseCase()

    const getOrderUseCaseReturn = await getOrderUseCase.execute({
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
      orderItems,
    })

    const responseBody: IGetOrderControllerResponse = {
      orders: getOrderUseCaseReturn,
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getOrderController }
