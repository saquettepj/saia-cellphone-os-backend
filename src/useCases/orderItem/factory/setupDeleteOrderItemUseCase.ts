import { DeleteOrderItemUseCase } from '../deleteOrderItemUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'
import { OrderItemRepository } from '@/repositories/orderItem/orderItemRepository'

function setupDeleteOrderItemUseCase() {
  const orderItemRepository = new OrderItemRepository()
  const productRepository = new ProductRepository()

  const deleteOrderItemUseCase = new DeleteOrderItemUseCase(
    orderItemRepository,
    productRepository,
  )

  return deleteOrderItemUseCase
}

export { setupDeleteOrderItemUseCase }
