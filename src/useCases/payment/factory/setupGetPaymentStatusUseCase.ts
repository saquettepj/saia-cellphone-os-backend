import { GetPaymentStatusUseCase } from '../getPaymentStatusUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupGetPaymentStatusUseCase() {
  const companyRepository = new CompanyRepository()

  return new GetPaymentStatusUseCase(companyRepository)
}

export { setupGetPaymentStatusUseCase }
