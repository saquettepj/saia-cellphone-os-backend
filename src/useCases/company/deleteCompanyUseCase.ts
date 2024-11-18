import { AccountTypeEnum } from '@/enums/all.enum'
import { env } from '@/env'
import { DeletingError } from '@/errors/deletingError'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IDeleteCompanyUseCaseRequest {
  id: string
  password: string
}

class DeleteCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id, password }: IDeleteCompanyUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findById(id)

    if (!password || password !== env.ADMIN_DELETE_PASSWORD) {
      throw new DeletingError()
    }

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
