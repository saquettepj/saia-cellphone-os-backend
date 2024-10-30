import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { OrderRepository } from '@/repositories/order/orderRepository'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { OrderItemRepository } from '@/repositories/orderItem/OrderItemRepository'
import { ISimpleOrderItemDTO } from '@/dtos/orderItems/ISimpleOrderItemDTO'

const orderItemCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { id: orderItemId } = ISimpleOrderItemDTO.parse(request.params)

  const orderItemRepository = new OrderItemRepository()
  const orderRepository = new OrderRepository()
  const employeeRepository = new EmployeeRepository()
  const companyRepository = new CompanyRepository()

  const searchedOrderItem = await orderItemRepository.findById(orderItemId)
  if (!searchedOrderItem) {
    throw new MiddlewareError({
      statusCode: 404,
      message: 'OrderItem not found!',
    })
  }

  const searchedOrder = await orderRepository.findById(
    searchedOrderItem.orderId,
  )
  if (!searchedOrder) {
    throw new MiddlewareError({
      statusCode: 404,
      message: 'Order not found!',
    })
  }

  const searchedEmployee = await employeeRepository.findById(
    searchedOrder.employeeId,
  )

  if (!searchedEmployee) {
    throw new MiddlewareError({
      statusCode: 404,
      message: 'Employee not found!',
    })
  }

  const searchedCompany = await companyRepository.findById(companyId)
  if (
    searchedEmployee.companyId !== companyId &&
    searchedCompany?.accountType !== AccountTypeEnum.ADMIN
  ) {
    throw new MiddlewareError({
      statusCode: 401,
      message: 'Request not allowed!',
    })
  }
}

export { orderItemCheckerByCompanyMiddleware }
