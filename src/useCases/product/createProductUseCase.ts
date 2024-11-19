import { IProductRepository } from '@/repositories/product/IProductRepository'
import { ISupplierRepository } from '@/repositories/supplier/ISupplierRepository'
import { ProductDescriptionAlreadyExistsError } from '@/errors/productDescriptionAlreadyExistsError'
import { SupplierNotFoundError } from '@/errors/supplierNotFoundError'

interface ICreateProductUseCaseRequest {
  companyId: string
  type: string
  price: number
  cost: number
  condition: string
  description: string
  quantity: number
  localization?: string
  supplierId?: string | null
}

class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute({
    companyId,
    type,
    price,
    cost,
    condition,
    description,
    quantity,
    localization,
    supplierId,
  }: ICreateProductUseCaseRequest) {
    const searchedProduct =
      await this.productRepository.findByDescriptionAndCompanyId(
        description,
        companyId,
      )

    if (searchedProduct) {
      throw new ProductDescriptionAlreadyExistsError()
    }

    if (supplierId) {
      const searchedSupplier =
        await this.supplierRepository.findById(supplierId)

      if (!searchedSupplier) {
        throw new SupplierNotFoundError()
      }
    }

    const createdProduct = await this.productRepository.create({
      companyId,
      type,
      price,
      cost,
      condition,
      description,
      quantity,
      localization,
      supplierId,
    })

    return createdProduct
  }
}

export { CreateProductUseCase, ICreateProductUseCaseRequest }
