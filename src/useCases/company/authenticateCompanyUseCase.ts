import { compare } from 'bcrypt'
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
    name: string
    email: string
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

    const passwordMatch = await compare(password, searchedCompany.passwordHash)

    if (!passwordMatch) {
      throw new CompanyCredentialsError()
    }

    const token = sign({}, env.SESSION_TOKEN, {
      subject: searchedCompany.id,
      expiresIn: '1d',
    })

    const authenticateData: IAuthenticateCompanyUseCaseReturn = {
      company: {
        name: searchedCompany.name,
        email: searchedCompany.email,
      },
      token,
    }

    return authenticateData
  }
}

export { AuthenticateCompanyUseCase, IAuthenticateCompanyUseCaseRequest }
