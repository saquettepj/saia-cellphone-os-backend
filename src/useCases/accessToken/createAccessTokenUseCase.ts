import { IAccessTokenRepository } from '@/repositories/accessToken/IAccessTokenRepository'

interface ICreateAccessTokenUseCaseRequest {
  companyId?: string
}

class CreateAccessTokenUseCase {
  constructor(private accessTokenRepository: IAccessTokenRepository) {}

  async execute({ companyId }: ICreateAccessTokenUseCaseRequest) {
    const activatedAt = companyId ? new Date() : undefined

    const createdAccessToken = await this.accessTokenRepository.create({
      companyId,
      activatedAt,
    })

    return createdAccessToken
  }
}

export { CreateAccessTokenUseCase, ICreateAccessTokenUseCaseRequest }
