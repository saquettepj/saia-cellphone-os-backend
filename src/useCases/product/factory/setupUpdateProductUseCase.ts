import { UpdateProductUseCase } from '../updateProductUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'

function setupUpdateProductUseCase() {
  const productRepository = new ProductRepository()
  const updateProductUseCase = new UpdateProductUseCase(productRepository)

  return updateProductUseCase
}

export { setupUpdateProductUseCase }
