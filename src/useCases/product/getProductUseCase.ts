import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IGetProductsUseCaseRequest {
  companyId: string
  id?: string
  type?: string
  condition?: string
  description?: string
  price?: number
  cost?: number
  quantity?: number
  localization?: string
  supplierId?: string
}

class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    companyId,
    id,
    type,
    condition,
    description,
    price,
    cost,
    quantity,
    localization,
    supplierId,
  }: IGetProductsUseCaseRequest) {
    const searchedProducts = await this.productRepository.findAllByCompanyId(
      companyId,
      {
        id,
        type,
        condition,
        description,
        price,
        cost,
        quantity,
        localization,
        supplierId,
      },
    )

    return searchedProducts.map((product) => ({
      id: product.id,
      companyId: product.companyId,
      type: product.type,
      condition: product.condition,
      description: product.description,
      price: product.price,
      cost: product.cost,
      quantity: product.quantity,
      localization: product.localization,
      supplierId: product.supplierId,
    }))
  }
}

export { GetProductUseCase }
