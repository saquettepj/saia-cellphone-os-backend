import { DeleteManyOrderItemUseCase } from '../deleteManyOrderItemUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'
import { OrderItemRepository } from '@/repositories/orderItem/OrderItemRepository'

function setupDeleteManyOrderItemUseCase() {
  const orderItemRepository = new OrderItemRepository()
  const productRepository = new ProductRepository()

  const deleteManyOrderItemUseCase = new DeleteManyOrderItemUseCase(
    orderItemRepository,
    productRepository,
  )

  return deleteManyOrderItemUseCase
}

export { setupDeleteManyOrderItemUseCase }
