import { CreateProductUseCase } from '../createProductUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'

function setupCreateProductUseCase() {
  const productRepository = new ProductRepository()
  const createProductUseCase = new CreateProductUseCase(productRepository)

  return createProductUseCase
}

export { setupCreateProductUseCase }
