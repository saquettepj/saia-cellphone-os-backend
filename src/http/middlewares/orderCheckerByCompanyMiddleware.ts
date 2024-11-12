import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleOrderDTO } from '@/dtos/order/ISimpleOrderDTO'
import { MiddlewareError } from '@/errors/middlewareError'
import { OrderRepository } from '@/repositories/order/orderRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const orderCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { id: orderId } = ISimpleOrderDTO.parse(request.params)

  const orderRepository = new OrderRepository()
  const searchedOrder = await orderRepository.findById(orderId)

  if (!searchedOrder) {
    throw new MiddlewareError({
      statusCode: 404,
      message: translate(TranslationKeysEnum.ERROR_ORDER_NOT_FOUND),
      name: TranslationKeysEnum.ERROR_ORDER_NOT_FOUND,
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
      message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
      name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    })
  }
}

export { orderCheckerByCompanyMiddleware }
