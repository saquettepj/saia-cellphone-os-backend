import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { ProductRepository } from '@/repositories/product/productRepository'
import { ICheckerOrderItemsDTO } from '@/dtos/orderItems/ICheckerOrderItemsDTO'

const orderItemsCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { orderItems } = ICheckerOrderItemsDTO.parse(request.body)

  const productIds = orderItems.map((item) => item.productId)

  const productRepository = new ProductRepository()
  const searchedProducts = await productRepository.findManyByIds(productIds)

  if (searchedProducts.length !== productIds.length) {
    throw new MiddlewareError({
      statusCode: 404,
      message: 'One or more products not found!',
    })
  }

  const invalidProducts = searchedProducts.filter(
    (product) => product.companyId !== companyId,
  )

  if (invalidProducts.length > 0) {
    throw new MiddlewareError({
      statusCode: 401,
      message: 'One or more products do not belong to this company!',
    })
  }
}

export { orderItemsCheckerByCompanyMiddleware }
