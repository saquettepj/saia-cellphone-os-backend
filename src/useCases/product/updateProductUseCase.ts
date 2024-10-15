import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IUpdateProductUseCaseRequest {
  id: string
  type?: string
  price?: number
  condition?: string
  description?: string
  quantity?: number
}

class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    id,
    type,
    price,
    condition,
    description,
    quantity,
  }: IUpdateProductUseCaseRequest) {
    const result = await this.productRepository.updateById(id, {
      type,
      price,
      condition,
      description,
      quantity,
    })

    return result
  }
}

export { UpdateProductUseCase, IUpdateProductUseCaseRequest }
