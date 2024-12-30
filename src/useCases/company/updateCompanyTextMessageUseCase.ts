import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateCompanyTextMessageUseCaseRequest {
  id: string
  textMessage: string
}

class UpdateCompanyTextMessageUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id, textMessage }: IUpdateCompanyTextMessageUseCaseRequest) {
    const result = await this.companyRepository.updateById(id, {
      textMessage,
    })

    return result
  }
}

export {
  UpdateCompanyTextMessageUseCase,
  IUpdateCompanyTextMessageUseCaseRequest,
}
