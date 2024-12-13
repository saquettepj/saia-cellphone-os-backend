import { DeleteOrderUseCase } from '../deleteOrderUseCase'

import { PrismaTransaction } from '@/utils/transaction'

function setupDeleteOrderUseCase() {
  const transactionService = new PrismaTransaction()

  const deleteOrderUseCase = new DeleteOrderUseCase(transactionService)

  return deleteOrderUseCase
}

export { setupDeleteOrderUseCase }
