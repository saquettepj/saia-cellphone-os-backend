import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateCompanyTermsDateUseCaseRequest {
  id: string
}

class UpdateCompanyTermsDateUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id }: IUpdateCompanyTermsDateUseCaseRequest) {
    const result = await this.companyRepository.updateById(id, {
      termsDate: new Date(),
    })

    return result
  }
}

export { UpdateCompanyTermsDateUseCase, IUpdateCompanyTermsDateUseCaseRequest }
