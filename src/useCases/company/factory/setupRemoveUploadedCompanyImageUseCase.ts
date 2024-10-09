import { RemoveUploadedCompanyImageUseCase } from '../removeUploadedCompanyImageUseCase'

import { BucketRepository } from '@/repositories/bucket/bucketRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupRemoveUploadedCompanyImageUseCase() {
  const companyRepository = new CompanyRepository()
  const bucketRepository = new BucketRepository()
  const removeUploadedCompanyImageUseCase =
    new RemoveUploadedCompanyImageUseCase(companyRepository, bucketRepository)

  return removeUploadedCompanyImageUseCase
}

export { setupRemoveUploadedCompanyImageUseCase }
