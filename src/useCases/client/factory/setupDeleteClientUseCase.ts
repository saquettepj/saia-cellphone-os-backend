import { DeleteClientUseCase } from '../deleteClientUseCase'

import { ClientRepository } from '@/repositories/client/clientRepository'

function setupDeleteClientUseCase() {
  const clientRepository = new ClientRepository()
  const deleteClientUseCase = new DeleteClientUseCase(clientRepository)

  return deleteClientUseCase
}

export { setupDeleteClientUseCase }
