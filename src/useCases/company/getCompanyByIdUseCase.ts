import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IGetCompanyByIdUseCaseRequest {
  id: string
}

class GetCompanyByIdUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id }: IGetCompanyByIdUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findAllIncludeById(id)

    if (!searchedCompany) {
      throw new CompanyNotFoundError()
    }

    return searchedCompany
  }
}

export { GetCompanyByIdUseCase }
