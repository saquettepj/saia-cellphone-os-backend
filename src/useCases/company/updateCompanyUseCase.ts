import { compare } from 'bcrypt'

import { CompanyCredentialsError } from '@/errors/companyCredentialsError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateCompanyUseCaseRequest {
  CNPJ: string
  email?: string
  name?: string
  CEP?: string
  password: string
}

class UpdateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({
    CNPJ,
    email,
    name,
    CEP,
    password,
  }: IUpdateCompanyUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findByCNPJ(CNPJ)

    if (!searchedCompany) {
      throw new CompanyCredentialsError()
    }

    const passwordMatch = await compare(password, searchedCompany.passwordHash)

    if (!passwordMatch) {
      throw new CompanyCredentialsError()
    }

    const result = await this.companyRepository.updateById(searchedCompany.id, {
      CNPJ,
      email,
      name,
      CEP,
    })

    return result
  }
}

export { UpdateCompanyUseCase, IUpdateCompanyUseCaseRequest }
