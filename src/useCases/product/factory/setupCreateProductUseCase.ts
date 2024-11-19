import { CreateProductUseCase } from '../createProductUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'
import { SupplierRepository } from '@/repositories/supplier/supplierRepository'

function setupCreateProductUseCase() {
  const productRepository = new ProductRepository()
  const supplierRepository = new SupplierRepository()
  const createProductUseCase = new CreateProductUseCase(
    productRepository,
    supplierRepository,
  )

  return createProductUseCase
}

export { setupCreateProductUseCase }
