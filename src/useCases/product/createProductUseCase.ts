import { IProductRepository } from '@/repositories/product/IProductRepository'

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
    const product = await this.productRepository.create({
      companyId,
      type,
      price,
      condition,
      description,
      quantity,
    })

    return product
  }
}

export { CreateProductUseCase, ICreateProductUseCaseRequest }
