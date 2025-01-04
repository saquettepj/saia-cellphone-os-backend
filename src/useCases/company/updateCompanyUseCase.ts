import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { EmailAlreadyExistsError } from '@/errors/emailAlreadyExistsError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateCompanyUseCaseRequest {
  id: string
  email?: string
  name?: string
}

class UpdateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id, email, name }: IUpdateCompanyUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findById(id)

    if (!searchedCompany) {
      throw new CompanyNotFoundError()
    }

    if (email) {
      const searchedCompanyByEmail =
        await this.companyRepository.findByEmail(email)

      if (searchedCompanyByEmail) {
        throw new EmailAlreadyExistsError()
      }
    }

    const result = await this.companyRepository.updateById(searchedCompany.id, {
      email,
      name,
      emailChecked: email ? false : undefined,
    })

    return result
  }
}

export { UpdateCompanyUseCase, IUpdateCompanyUseCaseRequest }
