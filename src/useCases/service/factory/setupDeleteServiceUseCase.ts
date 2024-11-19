import { DeleteServiceUseCase } from '../deleteServiceUseCase'

import { ServiceRepository } from '@/repositories/service/serviceRepository'

function setupDeleteServiceUseCase() {
  const serviceRepository = new ServiceRepository()
  const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository)

  return deleteServiceUseCase
}

export { setupDeleteServiceUseCase }
