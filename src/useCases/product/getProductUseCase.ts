import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IGetProductsUseCaseRequest {
  companyId: string
  id?: string
  type?: string
  condition?: string
  description?: string
}

class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    companyId,
    id,
    type,
    condition,
    description,
  }: IGetProductsUseCaseRequest) {
    const searchedProducts = await this.productRepository.findAllByCompanyId(
      companyId,
      { id, type, condition, description },
    )

    return searchedProducts
  }
}

export { GetProductUseCase }
