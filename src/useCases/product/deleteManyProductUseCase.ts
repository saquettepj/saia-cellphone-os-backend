import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IDeleteManyProductUseCaseRequest {
  ids: string[]
}

class DeleteManyProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({ ids }: IDeleteManyProductUseCaseRequest) {
    const deletedProducts = await this.productRepository.deleteMany(ids)

    return deletedProducts
  }
}

export { DeleteManyProductUseCase, IDeleteManyProductUseCaseRequest }
