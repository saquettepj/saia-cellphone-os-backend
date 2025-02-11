import { IProductRepository } from '@/repositories/product/IProductRepository'
import { ISupplierRepository } from '@/repositories/supplier/ISupplierRepository'
import { ProductDescriptionAlreadyExistsError } from '@/errors/productDescriptionAlreadyExistsError'
import { SupplierNotFoundError } from '@/errors/supplierNotFoundError'

interface IUpdateProductUseCaseRequest {
  id: string
  companyId: string
  type?: string
  price?: number
  cost?: number
  condition?: string
  description?: string
  quantity?: number
  warrantyDays?: number
  localization?: string
  supplierId?: string
  NCM?: string
  cEAN?: string
}

class UpdateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute({
    id,
    companyId,
    type,
    price,
    cost,
    condition,
    description,
    quantity,
    warrantyDays,
    localization,
    supplierId,
    NCM,
    cEAN,
  }: IUpdateProductUseCaseRequest) {
    if (description) {
      const existingProduct =
        await this.productRepository.findByDescriptionAndCompanyId(
          description,
          companyId,
        )

      if (existingProduct && existingProduct.id !== id) {
        throw new ProductDescriptionAlreadyExistsError()
      }
    }

    if (supplierId) {
      const existingSupplier =
        await this.supplierRepository.findById(supplierId)

      if (!existingSupplier) {
        throw new SupplierNotFoundError()
      }
    }

    const result = await this.productRepository.updateById(id, {
      type,
      price,
      cost,
      condition,
      description,
      quantity,
      warrantyDays,
      localization,
      supplierId,
      NCM,
      cEAN,
    })

    return result
  }
}

export { UpdateProductUseCase, IUpdateProductUseCaseRequest }
