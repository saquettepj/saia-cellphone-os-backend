import { FastifyReply, FastifyRequest } from 'fastify'

import { ICheckerProductDTO } from '@/dtos/product/ICheckerProductDTO'
import { MiddlewareError } from '@/errors/middlewareError'
import { ProductRepository } from '@/repositories/product/productRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const productOnOthersCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { productId } = ICheckerProductDTO.parse(request.body)

  const productRepository = new ProductRepository()
  const searchedProduct = await productRepository.findById(productId)

  if (!searchedProduct) {
    throw new MiddlewareError({
      statusCode: 404,
      message: translate(TranslationKeysEnum.ERROR_PRODUCT_NOT_FOUND),
      name: TranslationKeysEnum.ERROR_PRODUCT_NOT_FOUND,
    })
  }

  const companyRepository = new CompanyRepository()
  const searchedCompany = await companyRepository.findById(companyId)

  if (
    searchedProduct.companyId !== companyId &&
    searchedCompany?.accountType !== AccountTypeEnum.ADMIN
  ) {
    throw new MiddlewareError({
      statusCode: 401,
      message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
      name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    })
  }
}

export { productOnOthersCheckerByCompanyMiddleware }
