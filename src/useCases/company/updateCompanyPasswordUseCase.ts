import { compare, hash } from 'bcrypt'

import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { PasswordConfirmationIsDifferentError } from '@/errors/passwordConfirmationIsDifferentError'
import { CompanyCredentialsError } from '@/errors/companyCredentialsError'

interface IUpdateCompanyPasswordUseCaseRequest {
  CNPJ: string
  currentPassword: string
  newPassword: string
  passwordConfirmation: string
}

class UpdateCompanyPasswordUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({
    CNPJ,
    currentPassword,
    newPassword,
    passwordConfirmation,
  }: IUpdateCompanyPasswordUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findByCNPJ(CNPJ)

    if (newPassword !== passwordConfirmation) {
      throw new PasswordConfirmationIsDifferentError()
    }

    if (!searchedCompany) {
      throw new CompanyCredentialsError()
    }

    const passwordMatch = await compare(
      currentPassword.trim(),
      searchedCompany.passwordHash,
    )

    if (!passwordMatch) {
      throw new CompanyCredentialsError()
    }

    const newPasswordHash = await hash(newPassword.trim(), 8)

    await this.companyRepository.updatePasswordByCNPJ(CNPJ, newPasswordHash)

    return searchedCompany
  }
}

export { UpdateCompanyPasswordUseCase, IUpdateCompanyPasswordUseCaseRequest }
