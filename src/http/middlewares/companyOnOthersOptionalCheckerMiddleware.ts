import { FastifyReply, FastifyRequest } from 'fastify'

import { MiddlewareError } from '@/errors/middlewareError'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { IOptionalCheckerCompanyDTO } from '@/dtos/company/IOptionalCheckerCompanyDTO'

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
        message: 'Company not found!',
      })
    }
  }
}

export { companyOnOthersOptionalCheckerMiddleware }
