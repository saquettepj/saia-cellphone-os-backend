import { CreateClientUseCase } from '../createClientUseCase'

import { ClientRepository } from '@/repositories/client/clientRepository'

function setupCreateClientUseCase() {
  const clientRepository = new ClientRepository()
  const createClientUseCase = new CreateClientUseCase(clientRepository)

  return createClientUseCase
}

export { setupCreateClientUseCase }
