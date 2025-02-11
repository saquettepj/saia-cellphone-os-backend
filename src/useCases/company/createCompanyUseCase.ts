import { hash } from 'argon2'

import { generateRandomNumber } from '@/utils/randomNumberGenerator'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { CompanyCNPJAlreadyExistsError } from '@/errors/companyCNPJAlreadyExistsError'
import { PasswordConfirmationIsDifferentError } from '@/errors/passwordConfirmationIsDifferentError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'

interface IAddressWithCompanyCreation {
  country: string
  city: string
  state: string
  neighborhood: string
  street: string
  streetNumber: string
  zipCode: string
}

interface ICreateCompanyUseCaseRequest {
  CNPJ: string
  email: string
  name: string
  country: string
  city: string
  state: string
  neighborhood: string
  street: string
  streetNumber: string
  zipCode: string
  termsDate: string | Date
  password: string
  passwordConfirmation: string
}

class CreateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({
    CNPJ,
    email,
    name,
    country,
    city,
    state,
    neighborhood,
    street,
    streetNumber,
    zipCode,
    termsDate,
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

    const passwordHash = await hash(password.trim())

    const emailConfirmationCode = generateRandomNumber(6)

    const address: IAddressWithCompanyCreation = {
      country,
      city,
      state,
      neighborhood,
      street,
      streetNumber,
      zipCode,
    }

    const createdCompany = await this.companyRepository.create(
      {
        CNPJ,
        email,
        name,
        termsDate,
        passwordHash,
        emailConfirmationCode,
      },
      address,
    )

    return createdCompany
  }
}

export { CreateCompanyUseCase, ICreateCompanyUseCaseRequest }
