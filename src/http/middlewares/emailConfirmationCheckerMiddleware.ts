import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'
import { CompanyRepository } from '@/repositories/company/companyRepository'

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
      message: 'Prerequisite for this action: email confirmation.',
    })
  }
}

export { emailConfirmationCheckerMiddleware }
