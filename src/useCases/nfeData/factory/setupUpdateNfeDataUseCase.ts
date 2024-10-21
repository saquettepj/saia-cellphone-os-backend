import { UpdateNfeDataUseCase } from '../updateNfeDataUseCase'

import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'

function setupUpdateNfeDataUseCase() {
  const nfeDataRepository = new NfeDataRepository()
  const updateNfeDataUseCase = new UpdateNfeDataUseCase(nfeDataRepository)

  return updateNfeDataUseCase
}

export { setupUpdateNfeDataUseCase }
