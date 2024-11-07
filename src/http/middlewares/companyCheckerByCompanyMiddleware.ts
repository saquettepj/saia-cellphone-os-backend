import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'
import { ISimpleCompanyDTO } from '@/dtos/company/ISimpleCompanyDTO'

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
      message: 'Company not found!',
    })
  }

  if (
    searchedCompany?.accountType !== AccountTypeEnum.ADMIN &&
    companyId !== targetCompanyId
  ) {
    throw new MiddlewareError({
      statusCode: 401,
      message: 'Not allowed!',
    })
  }
}

export { companyCheckerByCompanyMiddleware }
