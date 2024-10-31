import { IProductRepository } from '@/repositories/product/IProductRepository'
import { ProductDescriptionAlreadyExistsError } from '@/errors/productDescriptionAlreadyExistsError'

interface ICreateProductUseCaseRequest {
  companyId: string
  type: string
  price: number
  condition: string
  description: string
  quantity: number
}

class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    companyId,
    type,
    price,
    condition,
    description,
    quantity,
  }: ICreateProductUseCaseRequest) {
    const searchedProduct =
      await this.productRepository.findByDescriptionAndCompanyId(
        description,
        companyId,
      )

    if (searchedProduct) {
      throw new ProductDescriptionAlreadyExistsError()
    }

    const createdProduct = await this.productRepository.create({
      companyId,
      type,
      price,
      condition,
      description,
      quantity,
    })

    return createdProduct
  }
}

export { CreateProductUseCase, ICreateProductUseCaseRequest }
