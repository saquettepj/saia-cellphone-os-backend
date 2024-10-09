import { AccountTypeEnum } from '@/enums/all.enum'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { IBucketRepository } from '@/repositories/bucket/IBucketRepository'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IDeleteCompanyUseCaseRequest {
  id: string
}

interface IDeleteCompanyUseCaseReturn {
  productsIds: string[]
  imageNames: string[]
}

class DeleteCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private bucketRepository: IBucketRepository,
  ) {}

  async execute({ id }: IDeleteCompanyUseCaseRequest) {
    const allImageNames: string[] = []

    const searchedCompany = await this.companyRepository.findAllIncludeById(id)

    if (
      !searchedCompany ||
      searchedCompany.accountType === AccountTypeEnum.ADMIN
    ) {
      throw new CompanyNotFoundError()
    }

    await this.companyRepository.delete(id)

    if (searchedCompany?.companyImageUrl) {
      const imageName = searchedCompany.companyImageUrl.split('/').pop()
      if (imageName) {
        allImageNames.push(imageName)
      }
    }

    if (allImageNames.length > 0) {
      await this.bucketRepository.delete(allImageNames)
    }

    const result: IDeleteCompanyUseCaseReturn = {
      productsIds:
        searchedCompany?.products?.map((product) => product.id) || [],
      imageNames: allImageNames,
    }

    return result
  }
}

export { DeleteCompanyUseCase, IDeleteCompanyUseCaseRequest }
