import { hash } from 'bcrypt'

import { generateRandomNumber } from '@/utils/randomNumberGenerator'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { CompanyCNPJAlreadyExistsError } from '@/errors/companyCNPJAlreadyExistsError'
import { PasswordConfirmationIsDifferentError } from '@/errors/passwordConfirmationIsDifferentError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface ICreateCompanyUseCaseRequest {
  CNPJ: string
  email: string
  name: string
  password: string
  passwordConfirmation: string
}

class CreateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({
    CNPJ,
    email,
    name,
    password,
    passwordConfirmation,
  }: ICreateCompanyUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findByCNPJ(CNPJ)

    if (searchedCompany !== null) {
      throw new CompanyCNPJAlreadyExistsError()
    }

    if (password !== passwordConfirmation) {
      throw new PasswordConfirmationIsDifferentError()
    }

    const searchedEmail = await this.companyRepository.findByEmail(email)

    if (searchedEmail) {
      throw new EmailAlreadyExistsError()
    }

    const passwordHash = await hash(password.trim(), 8)

    const emailConfirmationCode = generateRandomNumber(6)

    const createdCompany = await this.companyRepository.create({
      CNPJ,
      email,
      name,
      passwordHash,
      emailConfirmationCode,
    })

    return createdCompany
  }
}

export { CreateCompanyUseCase, ICreateCompanyUseCaseRequest }
