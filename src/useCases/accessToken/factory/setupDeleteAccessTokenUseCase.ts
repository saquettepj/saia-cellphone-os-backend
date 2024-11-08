import { DeleteAccessTokenUseCase } from '../deleteAccessTokenUseCase'

import { AccessTokenRepository } from '@/repositories/accessToken/accessTokenRepository'

function setupDeleteAccessTokenUseCase() {
  const accessTokenRepository = new AccessTokenRepository()
  const deleteAccessTokenUseCase = new DeleteAccessTokenUseCase(
    accessTokenRepository,
  )

  return deleteAccessTokenUseCase
}

export { setupDeleteAccessTokenUseCase }
