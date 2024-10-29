import { DeleteOrderUseCase } from '../deleteOrderUseCase'

import { OrderRepository } from '@/repositories/order/orderRepository'
import { OrderItemRepository } from '@/repositories/orderItem/OrderItemRepository'
import { ProductRepository } from '@/repositories/product/productRepository'

function setupDeleteOrderUseCase() {
  const orderRepository = new OrderRepository()
  const orderItemRepository = new OrderItemRepository()
  const productRepository = new ProductRepository()

  const deleteOrderUseCase = new DeleteOrderUseCase(
    orderRepository,
    orderItemRepository,
    productRepository,
  )

  return deleteOrderUseCase
}

export { setupDeleteOrderUseCase }
