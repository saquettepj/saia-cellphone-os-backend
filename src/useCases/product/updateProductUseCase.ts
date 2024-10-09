import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IUpdateProductUseCaseRequest {
  id: string
  manufactureBy?: string
  model?: string
  condition?: string
  description?: string | null
}

class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    id,
    manufactureBy,
    model,
    condition,
    description,
  }: IUpdateProductUseCaseRequest) {
    const result = await this.productRepository.updateById(id, {
      manufactureBy,
      model,
      condition,
      description,
    })

    return result
  }
}

export { UpdateProductUseCase, IUpdateProductUseCaseRequest }
