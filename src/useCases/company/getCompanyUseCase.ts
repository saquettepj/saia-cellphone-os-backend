import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

class GetCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute() {
    const searchedCompanies =
      await this.companyRepository.findAllOrderByBusiness()

    if (!searchedCompanies || searchedCompanies.length === 0) {
      throw new CompanyNotFoundError()
    }

    return searchedCompanies
  }
}

export { GetCompanyUseCase }
