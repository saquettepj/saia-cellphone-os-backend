import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateCompanyListsUseCaseRequest {
  id: string
  lists: string[]
}

class UpdateCompanyListsUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id, lists }: IUpdateCompanyListsUseCaseRequest) {
    const result = await this.companyRepository.updateById(id, {
      lists,
    })

    return result
  }
}

export { UpdateCompanyListsUseCase, IUpdateCompanyListsUseCaseRequest }
