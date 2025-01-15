import { SendSupportEmailUseCase } from '../sendSupportEmailUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupSendSupportEmailUseCase() {
  const companyRepository = new CompanyRepository()
  const sendSupportEmailUseCase = new SendSupportEmailUseCase(companyRepository)

  return sendSupportEmailUseCase
}

export { setupSendSupportEmailUseCase }
