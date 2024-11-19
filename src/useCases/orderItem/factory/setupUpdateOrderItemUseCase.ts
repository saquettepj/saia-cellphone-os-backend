import { UpdateOrderItemUseCase } from '../updateOrderItemUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'
import { OrderItemRepository } from '@/repositories/orderItem/orderItemRepository'

function setupUpdateOrderItemUseCase() {
  const orderItemRepository = new OrderItemRepository()
  const productRepository = new ProductRepository()

  const updateOrderItemUseCase = new UpdateOrderItemUseCase(
    orderItemRepository,
    productRepository,
  )

  return updateOrderItemUseCase
}

export { setupUpdateOrderItemUseCase }
