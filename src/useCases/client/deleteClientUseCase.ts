import { DeleteDateNotAllowed } from '@/errors/deleteDateNotAllowed'
import { IClientRepository } from '@/repositories/client/IClientRepository'
import { checkIfCreationDateExceeded } from '@/utils/checkIfCreationDateExceeded'

interface IDeleteClientUseCaseRequest {
  id: string
}

class DeleteClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute({ id }: IDeleteClientUseCaseRequest) {
    const searchedClient = await this.clientRepository.findById(id)

    if (
      !searchedClient?.createdAt ||
      checkIfCreationDateExceeded(searchedClient.createdAt)
    ) {
      throw new DeleteDateNotAllowed()
    }

    const deletedClient = await this.clientRepository.delete(id)
    return deletedClient
  }
}

export { DeleteClientUseCase, IDeleteClientUseCaseRequest }
