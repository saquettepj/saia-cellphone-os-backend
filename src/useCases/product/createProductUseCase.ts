import { IProductRepository } from '@/repositories/product/IProductRepository'

interface ICreateProductUseCaseRequest {
  companyId: string
  manufactureBy: string
  model: string
  condition: string
  description?: string | null
}

class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    companyId,
    manufactureBy,
    model,
    condition,
    description,
  }: ICreateProductUseCaseRequest) {
    const createdProduct = await this.productRepository.create({
      companyId,
      manufactureBy,
      model,
      condition,
      description,
    })

    return createdProduct
  }
}

export { CreateProductUseCase, ICreateProductUseCaseRequest }
