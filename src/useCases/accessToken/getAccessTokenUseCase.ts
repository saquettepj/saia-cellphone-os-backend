import { AccessTokenNotFoundError } from '@/errors/accessTokenNotFoundError'
import { IAccessTokenRepository } from '@/repositories/accessToken/IAccessTokenRepository'

class GetAccessTokenUseCase {
  constructor(private accessTokenRepository: IAccessTokenRepository) {}

  async execute() {
    const accessTokens = await this.accessTokenRepository.findAll()

    if (!accessTokens || accessTokens.length === 0) {
      throw new AccessTokenNotFoundError()
    }

    return accessTokens
  }
}

export { GetAccessTokenUseCase }
