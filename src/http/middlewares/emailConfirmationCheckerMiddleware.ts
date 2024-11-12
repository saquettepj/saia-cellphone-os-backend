import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const emailConfirmationCheckerMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id } = ISimpleCompanyDTO.parse(request.company)

  const companyRepository = new CompanyRepository()

  const searchedCompany = await companyRepository.findById(id)

  if (!searchedCompany?.emailChecked) {
    throw new MiddlewareError({
      statusCode: 401,
      message: translate(
        TranslationKeysEnum.ERROR_PREREQUISITE_EMAIL_CONFIRMATION,
      ),
      name: TranslationKeysEnum.ERROR_PREREQUISITE_EMAIL_CONFIRMATION,
    })
  }
}

export { emailConfirmationCheckerMiddleware }
