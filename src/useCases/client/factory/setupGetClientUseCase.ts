import { GetClientUseCase } from '../getClientUseCase'

import { ClientRepository } from '@/repositories/client/clientRepository'

function setupGetClientUseCase() {
  const clientRepository = new ClientRepository()
  const getClientUseCase = new GetClientUseCase(clientRepository)

  return getClientUseCase
}

export { setupGetClientUseCase }
