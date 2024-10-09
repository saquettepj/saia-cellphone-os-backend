import { DeleteProductUseCase } from '../deleteProductUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'

function setupDeleteProductUseCase() {
  const productRepository = new ProductRepository()
  const deleteProductUseCase = new DeleteProductUseCase(productRepository)

  return deleteProductUseCase
}

export { setupDeleteProductUseCase }
