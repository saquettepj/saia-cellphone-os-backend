import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'
import { AccountTypeEnum } from '@/enums/all.enum'
import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyRepository } from '@/repositories/company/companyRepository'

const adminAuthenticatorMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const { id } = ISimpleCompanyDTO.parse(request.company)

  const companyRepository = new CompanyRepository()

  const searchedCompany = await companyRepository.findById(id)

  if (searchedCompany?.accountType !== AccountTypeEnum.ADMIN) {
    throw new MiddlewareError({
      message: 'Request not allowed!',
      statusCode: 401,
    })
  }
}

export { adminAuthenticatorMiddleware }
