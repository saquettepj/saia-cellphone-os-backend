import { AccountTypeEnum } from '@/enums/all.enum'
import { DeletingError } from '@/errors/deletingError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IDeleteCompanyUseCaseRequest {
  id: string
}

class DeleteCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id }: IDeleteCompanyUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findById(id)

    if (
      !searchedCompany ||
      searchedCompany.accountType === AccountTypeEnum.ADMIN
    ) {
      throw new DeletingError()
    }

    await this.companyRepository.delete(id)
  }
}

export { DeleteCompanyUseCase, IDeleteCompanyUseCaseRequest }
