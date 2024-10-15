import { IClientRepository } from '@/repositories/client/IClientRepository'

interface IDeleteClientUseCaseRequest {
  id: string
}

class DeleteClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute({ id }: IDeleteClientUseCaseRequest) {
    const deletedClient = await this.clientRepository.delete(id)
    return deletedClient
  }
}

export { DeleteClientUseCase, IDeleteClientUseCaseRequest }
