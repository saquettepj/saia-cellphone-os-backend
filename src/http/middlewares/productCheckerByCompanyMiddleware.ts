import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleProductDTO } from '@/dtos/product/ISimpleProductDTO'
import { MiddlewareError } from '@/errors/middlewareError'
import { ProductRepository } from '@/repositories/product/productRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'

const productCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id } = request.company

  const { id: productId } = ISimpleProductDTO.parse(request.params)

  const productRepository = new ProductRepository()
  const searchedProduct = await productRepository.findById(productId)

  if (!searchedProduct) {
    throw new MiddlewareError({
      statusCode: 404,
      message: 'Product not found!',
    })
  }

  const companyRepository = new CompanyRepository()
  const searchedCompany = await companyRepository.findById(id)

  if (
    searchedProduct.companyId !== id &&
    searchedCompany?.accountType !== AccountTypeEnum.ADMIN
  ) {
    throw new MiddlewareError({
      statusCode: 401,
      message: 'Request not allowed!',
    })
  }
}

export { productCheckerByCompanyMiddleware }
