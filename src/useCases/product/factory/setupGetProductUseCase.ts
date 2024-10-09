import { GetProductUseCase } from '../getProductUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'

function setupGetProductUseCase() {
  const productRepository = new ProductRepository()
  const getProductUseCase = new GetProductUseCase(productRepository)

  return getProductUseCase
}

export { setupGetProductUseCase }
