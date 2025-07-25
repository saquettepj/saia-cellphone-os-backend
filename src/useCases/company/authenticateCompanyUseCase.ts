import { verify } from 'argon2'
import { sign } from 'jsonwebtoken'

import { CompanyCredentialsError } from '@/errors/companyCredentialsError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { env } from '@/env'

interface IAuthenticateCompanyUseCaseRequest {
  CNPJ: string
  password: string
}

interface IAuthenticateCompanyUseCaseReturn {
  company: {
    id: string
    name: string
    email: string
    accountType: string
    payType: string | null
    withNfe: boolean | null
    payDate: Date | null
    termsDate: Date | null
    accessTokenActivatedAt: Date | null
  }
  token: string
}

class AuthenticateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute({ CNPJ, password }: IAuthenticateCompanyUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findByCNPJ(CNPJ)

    if (!searchedCompany) {
      throw new CompanyCredentialsError()
    }

    const passwordMatch = await verify(searchedCompany.passwordHash, password)

    if (!passwordMatch) {
      throw new CompanyCredentialsError()
    }

    const token = sign({}, env.SESSION_TOKEN, {
      subject: searchedCompany.id,
      expiresIn: '1d',
    })

    const authenticateData: IAuthenticateCompanyUseCaseReturn = {
      company: {
        id: searchedCompany.id,
        name: searchedCompany.name,
        email: searchedCompany.email,
        accountType: searchedCompany.accountType,
        payType: searchedCompany.payType,
        withNfe: searchedCompany.withNfe,
        payDate: searchedCompany.payDate,
        termsDate: searchedCompany.termsDate,
        accessTokenActivatedAt:
          searchedCompany?.accessToken?.activatedAt || null,
      },
      token,
    }

    return authenticateData
  }
}

export { AuthenticateCompanyUseCase, IAuthenticateCompanyUseCaseRequest }
