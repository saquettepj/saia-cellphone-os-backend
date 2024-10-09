import { DeleteManyProductUseCase } from '../deleteManyProductUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'

function setupDeleteManyProductUseCase() {
  const productRepository = new ProductRepository()
  const deleteManyProductUseCase = new DeleteManyProductUseCase(
    productRepository,
  )

  return deleteManyProductUseCase
}

export { setupDeleteManyProductUseCase }
