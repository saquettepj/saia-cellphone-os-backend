import { DeleteOrderUseCase } from '../deleteOrderUseCase'

import { OrderRepository } from '@/repositories/order/orderRepository'

function setupDeleteOrderUseCase() {
  const orderRepository = new OrderRepository()
  const deleteOrderUseCase = new DeleteOrderUseCase(orderRepository)

  return deleteOrderUseCase
}

export { setupDeleteOrderUseCase }
