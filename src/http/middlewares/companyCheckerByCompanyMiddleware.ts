import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const companyCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company
  const { id: targetCompanyId } = ISimpleCompanyDTO.parse(request.params)

  const companyRepository = new CompanyRepository()
  const searchedCompany = await companyRepository.findById(companyId)

  const searchedTargetCompany =
    await companyRepository.findById(targetCompanyId)

  if (!searchedTargetCompany) {
    throw new MiddlewareError({
      statusCode: 404,
      message: translate(TranslationKeysEnum.ERROR_COMPANY_NOT_FOUND),
      name: TranslationKeysEnum.ERROR_COMPANY_NOT_FOUND,
    })
  }

  if (
    searchedCompany?.accountType !== AccountTypeEnum.ADMIN &&
    companyId !== targetCompanyId
  ) {
    throw new MiddlewareError({
      statusCode: 401,
      message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
      name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    })
  }
}

export { companyCheckerByCompanyMiddleware }
