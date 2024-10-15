import { UpdateClientUseCase } from '../updateClientUseCase'

import { ClientRepository } from '@/repositories/client/clientRepository'

function setupUpdateClientUseCase() {
  const clientRepository = new ClientRepository()
  const updateClientUseCase = new UpdateClientUseCase(clientRepository)

  return updateClientUseCase
}

export { setupUpdateClientUseCase }
