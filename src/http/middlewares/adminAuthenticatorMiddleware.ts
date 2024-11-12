import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'
import { AccountTypeEnum } from '@/enums/all.enum'
import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const adminAuthenticatorMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id } = ISimpleCompanyDTO.parse(request.company)

  const companyRepository = new CompanyRepository()

  const searchedCompany = await companyRepository.findById(id)

  if (searchedCompany?.accountType !== AccountTypeEnum.ADMIN) {
    throw new MiddlewareError({
      message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
      statusCode: 401,
      name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    })
  }
}

export { adminAuthenticatorMiddleware }
