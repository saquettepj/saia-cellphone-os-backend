import { CreateOrUpdateNfeDataUseCase } from '../createOrUpdateNfeDataUseCase'

import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'

function setupCreateOrUpdateNfeDataUseCase() {
  const nfeDataRepository = new NfeDataRepository()
  const createOrUpdateNfeDataUseCase = new CreateOrUpdateNfeDataUseCase(
    nfeDataRepository,
  )

  return createOrUpdateNfeDataUseCase
}

export { setupCreateOrUpdateNfeDataUseCase }
