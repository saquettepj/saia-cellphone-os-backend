import { UpdateOrderUseCase } from '../updateOrderUseCase'

import { ClientRepository } from '@/repositories/client/clientRepository'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { PrismaTransaction } from '@/utils/transaction'

function setupUpdateOrderUseCase() {
  const clientRepository = new ClientRepository()
  const employeeRepository = new EmployeeRepository()
  const transactionService = new PrismaTransaction()

  const updateOrderUseCase = new UpdateOrderUseCase(
    transactionService, // Injeção do serviço de transação
    clientRepository,
    employeeRepository,
  )

  return updateOrderUseCase
}

export { setupUpdateOrderUseCase }
