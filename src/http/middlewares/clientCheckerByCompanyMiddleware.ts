import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { ClientRepository } from '@/repositories/client/clientRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { ISimpleClientDTO } from '@/dtos/client/ISimpleClientDTO'

const clientCheckerByCompanyMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id: companyId } = request.company

  const { id: clientId } = ISimpleClientDTO.parse(request.params)

  const clientRepository = new ClientRepository()
  const searchedClient = await clientRepository.findById(clientId)

  if (!searchedClient) {
    throw new MiddlewareError({
      statusCode: 404,
      message: 'Client not found!',
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
      message: 'Not allowed!',
    })
  }
}

export { clientCheckerByCompanyMiddleware }
