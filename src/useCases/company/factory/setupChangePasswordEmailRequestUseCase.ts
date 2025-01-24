import { ChangePasswordEmailRequestUseCase } from '../changePasswordEmailRequestUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

export function setupChangePasswordEmailRequestUseCase() {
  const companyRepository = new CompanyRepository()
  return new ChangePasswordEmailRequestUseCase(companyRepository)
}
