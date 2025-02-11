import { CompanyCNPJAlreadyExistsError } from '@/errors/companyCNPJAlreadyExistsError'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface ISuperUpdateCompanyUseCaseRequest {
  id: string
  CNPJ?: string
  email?: string
  name?: string
  emailChecked?: boolean
  payType?: string
  withNfe?: boolean
  payDate?: string
}

class SuperUpdateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({
    id,
    CNPJ,
    email,
    name,
    emailChecked,
    payType,
    withNfe,
    payDate,
  }: ISuperUpdateCompanyUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findById(id)

    if (!searchedCompany) {
      throw new CompanyNotFoundError()
    }

    if (CNPJ) {
      const searchedCompanyByCNPJ =
        await this.companyRepository.findByCNPJ(CNPJ)

      if (searchedCompanyByCNPJ) {
        throw new CompanyCNPJAlreadyExistsError()
      }
    }

    if (email) {
      const searchedCompanyByEmail =
        await this.companyRepository.findByEmail(email)

      if (searchedCompanyByEmail) {
        throw new EmailAlreadyExistsError()
      }
    }

    const result = await this.companyRepository.updateById(searchedCompany.id, {
      CNPJ,
      email,
      name,
      emailChecked,
      payType,
      withNfe,
      payDate,
    })

    return result
  }
}

export { SuperUpdateCompanyUseCase, ISuperUpdateCompanyUseCaseRequest }
