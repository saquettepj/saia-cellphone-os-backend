import { CompanyCredentialsError } from '@/errors/companyCredentialsError'
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
      throw new CompanyCredentialsError()
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
    })

    return result
  }
}

export { UpdateCompanyUseCase, IUpdateCompanyUseCaseRequest }
