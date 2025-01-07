import { CreatePaymentUseCase } from '../createPaymentUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupCreatePaymentUseCase() {
  const companyRepository = new CompanyRepository()

  return new CreatePaymentUseCase(companyRepository)
}

export { setupCreatePaymentUseCase }
