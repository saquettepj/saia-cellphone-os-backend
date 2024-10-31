import { IProductRepository } from '@/repositories/product/IProductRepository'
import { ProductDescriptionAlreadyExistsError } from '@/errors/productDescriptionAlreadyExistsError'

interface IUpdateProductUseCaseRequest {
  id: string
  companyId: string
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
    companyId,
    type,
    price,
    condition,
    description,
    quantity,
  }: IUpdateProductUseCaseRequest) {
    if (description) {
      const existingProduct =
        await this.productRepository.findByDescriptionAndCompanyId(
          description,
          companyId,
        )
      console.log(existingProduct)
      if (existingProduct && existingProduct.id !== id) {
        throw new ProductDescriptionAlreadyExistsError()
      }
    }

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
