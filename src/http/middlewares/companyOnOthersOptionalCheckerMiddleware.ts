import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { IOptionalCheckerCompanyDTO } from '@/dtos/company/IOptionalCheckerCompanyDTO'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const companyOnOthersOptionalCheckerMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { companyId: targetCompanyId } = IOptionalCheckerCompanyDTO.parse(
    request.body,
  )

  if (targetCompanyId) {
    const companyRepository = new CompanyRepository()

    const searchedTargetCompany =
      await companyRepository.findById(targetCompanyId)

    if (!searchedTargetCompany) {
      throw new MiddlewareError({
        statusCode: 404,
        message: translate(TranslationKeysEnum.ERROR_COMPANY_NOT_FOUND),
        name: TranslationKeysEnum.ERROR_COMPANY_NOT_FOUND,
      })
    }
  }
}

export { companyOnOthersOptionalCheckerMiddleware }
