import { CreateOrderItemUseCase } from '../createOrderItemUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'
import { OrderItemRepository } from '@/repositories/orderItem/OrderItemRepository'

function setupCreateOrderItemUseCase() {
  const orderItemRepository = new OrderItemRepository()
  const productRepository = new ProductRepository()

  const createOrderItemUseCase = new CreateOrderItemUseCase(
    orderItemRepository,
    productRepository,
  )

  return createOrderItemUseCase
}

export { setupCreateOrderItemUseCase }
