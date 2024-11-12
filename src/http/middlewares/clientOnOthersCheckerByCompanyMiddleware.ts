import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { ClientRepository } from '@/repositories/client/clientRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { ICheckerClientDTO } from '@/dtos/client/ICheckerClientDTO'
import { translate } from '@/i18n/translate'
import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

const clientOnOthersCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { clientId } = ICheckerClientDTO.parse(request.body)

  const clientRepository = new ClientRepository()
  const searchedClient = await clientRepository.findById(clientId)

  if (!searchedClient) {
    throw new MiddlewareError({
      statusCode: 404,
      message: translate(TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND),
      name: TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND,
    })
  }

  const companyRepository = new CompanyRepository()
  const searchedCompany = await companyRepository.findById(companyId)

  if (
    searchedClient.companyId !== companyId &&
    searchedCompany?.accountType !== AccountTypeEnum.ADMIN
  ) {
    throw new MiddlewareError({
      statusCode: 401,
      message: translate(TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED),
      name: TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED,
    })
  }
}

export { clientOnOthersCheckerByCompanyMiddleware }
