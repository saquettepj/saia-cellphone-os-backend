import { DeleteCompanyUseCase } from '../deleteCompanyUseCase'

import { BucketRepository } from '@/repositories/bucket/bucketRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupDeleteCompanyUseCase() {
  const companyRepository = new CompanyRepository()
  const bucketRepository = new BucketRepository()
  const deleteCompanyUseCase = new DeleteCompanyUseCase(
    companyRepository,
    bucketRepository,
  )

  return deleteCompanyUseCase
}

export { setupDeleteCompanyUseCase }
