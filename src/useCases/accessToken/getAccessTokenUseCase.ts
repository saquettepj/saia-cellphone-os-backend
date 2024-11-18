import { IAccessTokenRepository } from '@/repositories/accessToken/IAccessTokenRepository'

class GetAccessTokenUseCase {
  constructor(private accessTokenRepository: IAccessTokenRepository) {}

  async execute() {
    const accessTokens = await this.accessTokenRepository.findAll()

    return accessTokens
  }
}

export { GetAccessTokenUseCase }
