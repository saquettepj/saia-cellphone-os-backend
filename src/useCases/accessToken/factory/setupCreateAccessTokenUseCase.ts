import { CreateAccessTokenUseCase } from '../createAccessTokenUseCase'

import { AccessTokenRepository } from '@/repositories/accessToken/accessTokenRepository'

function setupCreateAccessTokenUseCase() {
  const accessTokenRepository = new AccessTokenRepository()
  const createAccessTokenUseCase = new CreateAccessTokenUseCase(
    accessTokenRepository,
  )

  return createAccessTokenUseCase
}

export { setupCreateAccessTokenUseCase }
