import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IDeleteManyProductUseCaseRequest {
  ids: string[]
}

interface IDeleteManyProductUseCaseReturn {
  ids: string[]
}

class DeleteManyProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({ ids }: IDeleteManyProductUseCaseRequest) {
    const result = await this.productRepository.deleteMany(ids)

    const formattedResult: IDeleteManyProductUseCaseReturn = {
      ids: result.map((result) => result.id),
    }

    return formattedResult
  }
}

export { DeleteManyProductUseCase, IDeleteManyProductUseCaseRequest }
