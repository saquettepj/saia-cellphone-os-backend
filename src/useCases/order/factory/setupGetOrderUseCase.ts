import { GetOrderUseCase } from '../getOrderUseCase'

import { OrderRepository } from '@/repositories/order/orderRepository'

function setupGetOrderUseCase() {
  const orderRepository = new OrderRepository()
  const getOrderUseCase = new GetOrderUseCase(orderRepository)

  return getOrderUseCase
}

export { setupGetOrderUseCase }
