import { FastifyReply, FastifyRequest } from 'fastify'

import { ISimpleNfeDataDTO } from '@/dtos/nfeData/ISimpleNfeDataDTO'
import { MiddlewareError } from '@/errors/middlewareError'
import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'
import { AccountTypeEnum } from '@/enums/all.enum'

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
      message: 'NfeData not found!',
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
      message: 'Request not allowed!',
    })
  }
}

export { nfeDataCheckerByCompanyMiddleware }
