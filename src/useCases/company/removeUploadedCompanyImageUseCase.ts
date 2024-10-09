import { Company } from '@prisma/client'

import { IBucketRepository } from '@/repositories/bucket/IBucketRepository'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { ImageNotFoundError } from '@/errors/imageNotFoundError'
import { RequestFormattingError } from '@/errors/requestFormattingError'

interface IRemoveUploadedCompanyImageUseCaseRequest {
  id: string
  url: string
}

interface IRemoveUploadedCompanyImageUseCaseReturn {
  company: Company | null
}

class RemoveUploadedCompanyImageUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private bucketRepository: IBucketRepository,
  ) {}

  async execute({ id }: IRemoveUploadedCompanyImageUseCaseRequest) {
    const searchedCompany = await this.companyRepository.findById(id)

    if (!searchedCompany?.companyImageUrl) {
      throw new ImageNotFoundError()
    }

    const imageName = searchedCompany.companyImageUrl.split('/').pop() ?? ''

    if (imageName === '') {
      throw new RequestFormattingError()
    }

    await this.bucketRepository.delete([imageName])
    const updateResult = await this.companyRepository.updateById(id, {
      companyImageUrl: null,
    })

    const result: IRemoveUploadedCompanyImageUseCaseReturn = {
      company: updateResult,
    }
    return result
  }
}

export {
  RemoveUploadedCompanyImageUseCase,
  IRemoveUploadedCompanyImageUseCaseRequest,
}
