import { UpdateProductUseCase } from '../updateProductUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'
import { SupplierRepository } from '@/repositories/supplier/supplierRepository'

function setupUpdateProductUseCase() {
  const productRepository = new ProductRepository()
  const supplierRepository = new SupplierRepository()
  const updateProductUseCase = new UpdateProductUseCase(
    productRepository,
    supplierRepository,
  )

  return updateProductUseCase
}

export { setupUpdateProductUseCase }
