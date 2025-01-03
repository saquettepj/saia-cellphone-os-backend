import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateCompanyTermsUseCaseRequest {
  id: string
}

class UpdateCompanyTermsUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id }: IUpdateCompanyTermsUseCaseRequest) {
    const result = await this.companyRepository.updateById(id, {
      termsDate: new Date(),
    })

    return result
  }
}

export { UpdateCompanyTermsUseCase, IUpdateCompanyTermsUseCaseRequest }
