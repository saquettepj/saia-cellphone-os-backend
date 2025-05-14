import { ImportClientsUseCase } from '../importClientsUseCase'

import { ClientRepository } from '@/repositories/client/clientRepository'

function setupImportClientsUseCase() {
  const clientRepository = new ClientRepository()
  const importClientsUseCase = new ImportClientsUseCase(clientRepository)

  return importClientsUseCase
}

export { setupImportClientsUseCase }
