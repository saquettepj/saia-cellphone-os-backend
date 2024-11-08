import { GetAccessTokenUseCase } from '../getAccessTokenUseCase'

import { AccessTokenRepository } from '@/repositories/accessToken/accessTokenRepository'

function setupGetAccessTokenUseCase() {
  const accessTokenRepository = new AccessTokenRepository()
  const getAccessTokenUseCase = new GetAccessTokenUseCase(accessTokenRepository)

  return getAccessTokenUseCase
}

export { setupGetAccessTokenUseCase }
