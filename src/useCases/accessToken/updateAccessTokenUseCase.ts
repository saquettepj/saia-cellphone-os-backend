import { AccessTokenNotFoundError } from '@/errors/accessTokenNotFoundError'
import { AnAccessTokenAlreadyHasCompanyIdError } from '@/errors/anAccessTokenAlreadyHasCompanyIdError'
import { CompanyNotFoundError } from '@/errors/companyNotFoundError'
import { ThisAccessTokenAlreadyHasCompanyIdError } from '@/errors/thisAccessTokenAlreadyHasCompanyIdError'
import { IAccessTokenRepository } from '@/repositories/accessToken/IAccessTokenRepository'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'

interface IUpdateAccessTokenUseCaseRequest {
  id: string
  companyId?: string
}

class UpdateAccessTokenUseCase {
  constructor(
    private accessTokenRepository: IAccessTokenRepository,
    private companyRepository: ICompanyRepository,
  ) {}

  async execute({ id, companyId }: IUpdateAccessTokenUseCaseRequest) {
    const accessToken = await this.accessTokenRepository.findById(id)

    if (!accessToken) {
      throw new AccessTokenNotFoundError()
    }

    if (accessToken.companyId) {
      throw new ThisAccessTokenAlreadyHasCompanyIdError()
    }

    if (companyId) {
      const companyExists = await this.companyRepository.findById(companyId)
      if (!companyExists) {
        throw new CompanyNotFoundError()
      }

      const existingAccessTokenWithCompany =
        await this.accessTokenRepository.findByCompanyId(companyId)
      if (existingAccessTokenWithCompany) {
        throw new AnAccessTokenAlreadyHasCompanyIdError()
      }
    }

    await this.accessTokenRepository.update(id, {
      companyId,
      updatedAt: new Date(),
    })
  }
}

export { UpdateAccessTokenUseCase, IUpdateAccessTokenUseCaseRequest }
