import { UploadCompanyImageUseCase } from '../uploadCompanyImageUseCase'

import { BucketRepository } from '@/repositories/bucket/bucketRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUploadCompanyImageUseCase() {
  const companyRepository = new CompanyRepository()
  const bucketRepository = new BucketRepository()
  const uploadCompanyImageUseCase = new UploadCompanyImageUseCase(
    companyRepository,
    bucketRepository,
  )

  return uploadCompanyImageUseCase
}

export { setupUploadCompanyImageUseCase }
