import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { OrderRepository } from '@/repositories/order/orderRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { ICheckerOrderDTO } from '@/dtos/order/ICheckerOrderDTO'

const orderOnOthersCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { orderId } = ICheckerOrderDTO.parse(request.body)

  const orderRepository = new OrderRepository()
  const searchedOrder = await orderRepository.findById(orderId)

  if (!searchedOrder) {
    throw new MiddlewareError({
      statusCode: 404,
      message: 'Order not found!',
    })
  }

  const companyRepository = new CompanyRepository()
  const searchedCompany = await companyRepository.findById(companyId)

  if (
    searchedOrder.companyId !== companyId &&
    searchedCompany?.accountType !== AccountTypeEnum.ADMIN
  ) {
    throw new MiddlewareError({
      statusCode: 401,
      message: 'Request not allowed!',
    })
  }
}

export { orderOnOthersCheckerByCompanyMiddleware }
