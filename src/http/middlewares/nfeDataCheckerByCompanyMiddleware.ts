import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleNfeDataDTO } from '@/dtos/nfeData/ISimpleNfeDataDTO'
import { MiddlewareError } from '@/errors/middlewareError'
import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const nfeDataCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { id: nfeDataId } = ISimpleNfeDataDTO.parse(request.params)

  const nfeDataRepository = new NfeDataRepository()
  const searchedNfeData = await nfeDataRepository.findById(nfeDataId)

  if (!searchedNfeData) {
    throw new MiddlewareError({
      statusCode: 404,
      message: translate(TranslationKeysEnum.ERROR_NFE_DATA_NOT_FOUND),
      name: TranslationKeysEnum.ERROR_NFE_DATA_NOT_FOUND,
    })
  }

  const companyRepository = new CompanyRepository()
  const searchedCompany = await companyRepository.findById(companyId)

  if (
    searchedNfeData.companyId !== companyId &&
    searchedCompany?.accountType !== AccountTypeEnum.ADMIN
  ) {
    throw new MiddlewareError({
      statusCode: 401,
      message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
      name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    })
  }
}

export { nfeDataCheckerByCompanyMiddleware }
