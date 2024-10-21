import { INfeDataRepository } from '@/repositories/nfeData/INfeDataRepository'

interface IDeleteNfeDataUseCaseRequest {
  id: string
}

interface IDeleteNfeDataUseCaseReturn {
  id: string
}

class DeleteNfeDataUseCase {
  constructor(private nfeDataRepository: INfeDataRepository) {}

  async execute({ id }: IDeleteNfeDataUseCaseRequest) {
    await this.nfeDataRepository.delete(id)

    const result: IDeleteNfeDataUseCaseReturn = {
      id,
    }

    return result
  }
}

export { DeleteNfeDataUseCase, IDeleteNfeDataUseCaseRequest }
