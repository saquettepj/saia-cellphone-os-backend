import { DeleteNfeDataUseCase } from '../deleteNfeDataUseCase'

import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'

function setupDeleteNfeDataUseCase() {
  const nfeDataRepository = new NfeDataRepository()
  const deleteNfeDataUseCase = new DeleteNfeDataUseCase(nfeDataRepository)

  return deleteNfeDataUseCase
}

export { setupDeleteNfeDataUseCase }
