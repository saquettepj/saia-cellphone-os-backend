import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateCompanyTermsUseCaseRequest {
  id: string
  termsDate: string | null
}

class UpdateCompanyTermsUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id, termsDate }: IUpdateCompanyTermsUseCaseRequest) {
    const result = await this.companyRepository.updateById(id, {
      termsDate,
    })

    return result
  }
}

export { UpdateCompanyTermsUseCase, IUpdateCompanyTermsUseCaseRequest }
