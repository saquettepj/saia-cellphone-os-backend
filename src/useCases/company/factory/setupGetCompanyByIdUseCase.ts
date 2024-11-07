import { GetCompanyByIdUseCase } from '../getCompanyByIdUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupGetCompanyByIdUseCase() {
  const companyRepository = new CompanyRepository()
  const getCompanyByIdUseCase = new GetCompanyByIdUseCase(companyRepository)

  return getCompanyByIdUseCase
}

export { setupGetCompanyByIdUseCase }
