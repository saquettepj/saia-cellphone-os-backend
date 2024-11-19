import { IServiceRepository } from '@/repositories/service/IServiceRepository'

interface IDeleteServiceUseCaseRequest {
  id: string
}

interface IDeleteServiceUseCaseReturn {
  id: string
}

class DeleteServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute({ id }: IDeleteServiceUseCaseRequest) {
    await this.serviceRepository.delete(id)

    const result: IDeleteServiceUseCaseReturn = {
      id,
    }

    return result
  }
}

export { DeleteServiceUseCase, IDeleteServiceUseCaseRequest }
