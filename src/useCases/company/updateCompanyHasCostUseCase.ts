import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateCompanyHasCostUseCaseRequest {
  id: string
  hasCost: boolean
}

class UpdateCompanyHasCostUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id, hasCost }: IUpdateCompanyHasCostUseCaseRequest) {
    const result = await this.companyRepository.updateById(id, {
      hasCost,
    })

    return result
  }
}

export { UpdateCompanyHasCostUseCase, IUpdateCompanyHasCostUseCaseRequest }
