import { CreateOrderUseCase } from '../createOrderUseCase'

import { OrderRepository } from '@/repositories/order/orderRepository'
import { ProductRepository } from '@/repositories/product/productRepository'

function setupCreateOrderUseCase() {
  const orderRepository = new OrderRepository()
  const productRepository = new ProductRepository()

  const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    productRepository,
  )

  return createOrderUseCase
}

export { setupCreateOrderUseCase }
