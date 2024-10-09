import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IDeleteProductUseCaseRequest {
  id: string
}

interface IDeleteProductUseCaseReturn {
  id: string
}

class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({ id }: IDeleteProductUseCaseRequest) {
    await this.productRepository.delete(id)

    const result: IDeleteProductUseCaseReturn = {
      id,
    }

    return result
  }
}

export { DeleteProductUseCase, IDeleteProductUseCaseRequest }
