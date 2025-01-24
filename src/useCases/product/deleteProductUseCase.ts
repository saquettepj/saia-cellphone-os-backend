import { DeleteDateNotAllowed } from '@/errors/deleteDateNotAllowed'
import { IProductRepository } from '@/repositories/product/IProductRepository'
import { checkIfCreationDateExceeded } from '@/utils/checkIfCreationDateExceeded'

interface IDeleteProductUseCaseRequest {
  id: string
}

interface IDeleteProductUseCaseReturn {
  id: string
}

class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({ id }: IDeleteProductUseCaseRequest) {
    const searchedProduct = await this.productRepository.findById(id)

    if (
      !searchedProduct?.createdAt ||
      checkIfCreationDateExceeded(searchedProduct.createdAt)
    ) {
      throw new DeleteDateNotAllowed()
    }

    await this.productRepository.delete(id)

    const result: IDeleteProductUseCaseReturn = {
      id,
    }

    return result
  }
}

export { DeleteProductUseCase, IDeleteProductUseCaseRequest }
