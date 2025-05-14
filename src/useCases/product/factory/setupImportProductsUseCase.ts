import { ImportProductsUseCase } from '../importProductsUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'

function setupImportProductsUseCase() {
  const productRepository = new ProductRepository()
  const importProductsUseCase = new ImportProductsUseCase(productRepository)

  return importProductsUseCase
}

export { setupImportProductsUseCase }
