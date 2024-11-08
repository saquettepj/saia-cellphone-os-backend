import { UpdateAccessTokenUseCase } from '../updateAccessTokenUseCase'

import { AccessTokenRepository } from '@/repositories/accessToken/accessTokenRepository'
import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUpdateAccessTokenUseCase() {
  const accessTokenRepository = new AccessTokenRepository()
  const companyRepository = new CompanyRepository()
  const updateAccessTokenUseCase = new UpdateAccessTokenUseCase(
    accessTokenRepository,
    companyRepository,
  )

  return updateAccessTokenUseCase
}

export { setupUpdateAccessTokenUseCase }
