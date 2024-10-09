import { SendEmailConfirmationUseCase } from '../sendEmailConfirmationUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupSendEmailConfirmationUseCase() {
  const companyRepository = new CompanyRepository()
  const sendEmailConfirmationUseCase = new SendEmailConfirmationUseCase(
    companyRepository,
  )

  return sendEmailConfirmationUseCase
}

export { setupSendEmailConfirmationUseCase }
