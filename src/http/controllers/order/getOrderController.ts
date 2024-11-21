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
    createdAt: Date
    orderItems?: Array<{
      id: string
      orderId: string
      initialQuantity: number
      discount: number | null
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
    IMEI,
    clientId,
    employeeId,
    type,
    status,
    paymentMethod,
    paymentStatus,
    dueDate,
    numberOfInstallments,
    interest,
    price,
    description,
  } = IGetOrderDTO.parse(request.query)

  try {
    const getOrderUseCase = setupGetOrderUseCase()

    const getOrderUseCaseReturn = await getOrderUseCase.execute({
      companyId,
      IMEI,
      clientId,
      employeeId,
      type,
      status,
      paymentMethod,
      paymentStatus,
      dueDate,
      numberOfInstallments,
      interest,
      price,
      description,
    })

    const responseBody: IGetOrderControllerResponse = {
      orders: getOrderUseCaseReturn.map((order) => ({
        id: order.id,
        companyId: order.companyId,
        clientId: order.clientId,
        employeeId: order.employeeId,
        number: order.number,
        type: order.type,
        status: order.status,
        payDate: order.payDate,
        paymentMethod: order.paymentMethod,
        price: order.price,
        description: order.description,
        paymentStatus: order.paymentStatus,
        closingDate: order.closingDate,
        firstDueDate: order.firstDueDate,
        dueDate: order.dueDate,
        numberOfInstallments: order.numberOfInstallments,
        interest: order.interest,
        createdAt: order.createdAt,
        orderItems: order.orderItems?.map((item) => ({
          id: item.id,
          orderId: item.orderId,
          initialQuantity: item.initialQuantity,
          discount: item.discount,
          productId: item.productId,
          quantity: item.quantity,
          service: item.service
            ? {
                employeeId: item.service.employeeId,
              }
            : null,
        })),
      })),
    }

    return reply.status(200).send(responseBody)
  } catch (error) {
    throw error
  }
}

export { getOrderController }
