import { IProductRepository } from '@/repositories/product/IProductRepository'

interface ICreateProductUseCaseRequest {
  companyId: string
  type: string
  condition: string
  description: string
  price: number
}

class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    companyId,
    type,
    condition,
    description,
    price,
  }: ICreateProductUseCaseRequest) {
    const createdProduct = await this.productRepository.create({
      companyId,
      type,
      condition,
      description,
      price,
    })

    return createdProduct
  }
}

export { CreateProductUseCase, ICreateProductUseCaseRequest }
