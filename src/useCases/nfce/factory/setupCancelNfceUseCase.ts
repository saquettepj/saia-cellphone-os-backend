import { CancelNfceUseCase } from '../cancelNfceUseCase'

import { NfeDataRepository } from '@/repositories/nfeData/nfeDataRepository'
import { OrderRepository } from '@/repositories/order/orderRepository'

function setupCancelNfceUseCase() {
  const nfeDataRepository = new NfeDataRepository()
  const orderRepository = new OrderRepository()

  const cancelNfceUseCase = new CancelNfceUseCase(
    nfeDataRepository,
    orderRepository,
  )

  return cancelNfceUseCase
}

export { setupCancelNfceUseCase }
