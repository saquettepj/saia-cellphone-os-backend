import { GetOrderItemUseCase } from '../getOrderItemUseCase'

import { OrderItemRepository } from '@/repositories/orderItem/orderItemRepository'

function setupGetOrderItemUseCase() {
  const orderItemRepository = new OrderItemRepository()
  const getOrderItemUseCase = new GetOrderItemUseCase(orderItemRepository)

  return getOrderItemUseCase
}

export { setupGetOrderItemUseCase }
