import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { ProductRepository } from '@/repositories/product/productRepository'
import { ICheckerOrderItemsDTO } from '@/dtos/orderItems/ICheckerOrderItemsDTO'
import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const orderItemsOnOthersCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { orderItems } = ICheckerOrderItemsDTO.parse(request.body)

  const productIds = orderItems.map((item) => item.productId)

  const productRepository = new ProductRepository()
  const searchedProducts = await productRepository.findManyByIds(productIds)

  const productIdsToCheck = new Set<string>()

  for (const item of orderItems) {
    if (productIdsToCheck.has(item.productId)) {
      const duplicateOrderItemError = new DuplicateOrderItemError()
      throw new MiddlewareError({
        statusCode: 400,
        message: duplicateOrderItemError.message,
        name: duplicateOrderItemError.name,
      })
    }
    productIdsToCheck.add(item.productId)
  }

  if (searchedProducts.length !== productIds.length) {
    throw new MiddlewareError({
      statusCode: 404,
      message: translate(TranslationKeysEnum.ERROR_PRODUCTS_NOT_FOUND),
      name: TranslationKeysEnum.ERROR_PRODUCTS_NOT_FOUND,
    })
  }

  const invalidProducts = searchedProducts.filter(
    (product) => product.companyId !== companyId,
  )

  if (invalidProducts.length > 0) {
    throw new MiddlewareError({
      statusCode: 401,
      message: translate(
        TranslationKeysEnum.ERROR_PRODUCTS_NOT_BELONG_TO_COMPANY,
      ),
      name: TranslationKeysEnum.ERROR_PRODUCTS_NOT_BELONG_TO_COMPANY,
    })
  }
}

export { orderItemsOnOthersCheckerByCompanyMiddleware }
