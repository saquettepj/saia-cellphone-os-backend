import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

class GetCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute() {
    const searchedCompanies =
      await this.companyRepository.findAllOrderByBusiness()

    return searchedCompanies
  }
}

export { GetCompanyUseCase }
