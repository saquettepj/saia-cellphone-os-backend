import { AccountTypeEnum } from '@/enums/all.enum'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { IBucketRepository } from '@/repositories/bucket/IBucketRepository'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IDeleteCompanyUseCaseRequest {
  id: string
}

interface IDeleteCompanyUseCaseReturn {
  productsIds: string[]
}

class DeleteCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute({ id }: IDeleteCompanyUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findAllIncludeById(id)

    if (
      !searchedCompany ||
      searchedCompany.accountType === AccountTypeEnum.ADMIN
    ) {
      throw new CompanyNotFoundError()
    }

    await this.companyRepository.delete(id)

    const result: IDeleteCompanyUseCaseReturn = {
      productsIds:
        searchedCompany?.products?.map((product) => product.id) || [],
    }

    return result
  }
}

export { DeleteCompanyUseCase, IDeleteCompanyUseCaseRequest }
