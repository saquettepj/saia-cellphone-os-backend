import { CreateNfeDataUseCase } from '../createNfeDataUseCase'

import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'

function setupCreateNfeDataUseCase() {
  const nfeDataRepository = new NfeDataRepository()
  const createNfeDataUseCase = new CreateNfeDataUseCase(nfeDataRepository)

  return createNfeDataUseCase
}

export { setupCreateNfeDataUseCase }
