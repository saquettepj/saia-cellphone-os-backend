import { GetServiceUseCase } from '../getServiceUseCase'

import { ServiceRepository } from '@/repositories/service/serviceRepository'

function setupGetServiceUseCase() {
  const serviceRepository = new ServiceRepository()
  const getServiceUseCase = new GetServiceUseCase(serviceRepository)

  return getServiceUseCase
}

export { setupGetServiceUseCase }
