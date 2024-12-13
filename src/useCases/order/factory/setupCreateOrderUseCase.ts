import { CreateOrderUseCase } from '../createOrderUseCase'

import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { PrismaTransaction } from '@/utils/transaction'

function setupCreateOrderUseCase() {
  const transactionService = new PrismaTransaction()
  const employeeRepository = new EmployeeRepository()

  const createOrderUseCase = new CreateOrderUseCase(
    transactionService,
    employeeRepository,
  )

  return createOrderUseCase
}

export { setupCreateOrderUseCase }
