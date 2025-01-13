import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateCompanyTermsUseCaseRequest {
  id: string
  companyTerms: string
}

class UpdateCompanyTermsUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id, companyTerms }: IUpdateCompanyTermsUseCaseRequest) {
    const result = await this.companyRepository.updateById(id, {
      companyTerms,
    })

    return result
  }
}

export { UpdateCompanyTermsUseCase, IUpdateCompanyTermsUseCaseRequest }
