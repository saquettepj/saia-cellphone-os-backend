import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IImportProductsUseCaseRequest {
  products: {
    type: string
    condition: string
    description: string
    price: number
    cost: number
    quantity: number
    localization?: string
    cEAN?: string
  }[]
  companyId: string
}

export class ImportProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: IImportProductsUseCaseRequest) {
    const { companyId, products } = data

    const descriptions = products.map((product) => product.description)

    const existingProducts = await Promise.all(
      descriptions.map((description) =>
        this.productRepository.findByDescriptionAndCompanyId(
          description,
          companyId,
        ),
      ),
    )

    const existingDescriptions = new Set(
      existingProducts
        .filter((product) => product !== null)
        .map((product) => product!.description),
    )

    const newProducts = products.filter(
      (product) => !existingDescriptions.has(product.description),
    )

    const toCreate = newProducts.map((product) => ({
      ...product,
      companyId,
    }))

    const createdProducts = await this.productRepository.createMany(toCreate)

    return createdProducts
  }
}
