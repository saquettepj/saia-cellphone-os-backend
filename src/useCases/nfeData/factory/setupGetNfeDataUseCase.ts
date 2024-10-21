import { GetNfeDataUseCase } from '../getNfeDataUseCase'

import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'

function setupGetNfeDataUseCase() {
  const nfeDataRepository = new NfeDataRepository()
  const getNfeDataUseCase = new GetNfeDataUseCase(nfeDataRepository)

  return getNfeDataUseCase
}

export { setupGetNfeDataUseCase }
