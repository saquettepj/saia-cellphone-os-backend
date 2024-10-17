import { CreateOrderUseCase } from '../createOrderUseCase'

import { OrderRepository } from '@/repositories/order/orderRepository'
import { ClientRepository } from '@/repositories/client/clientRepository'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'

function setupCreateOrderUseCase() {
  const orderRepository = new OrderRepository()
  const clientRepository = new ClientRepository()
  const employeeRepository = new EmployeeRepository()

  const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    clientRepository,
    employeeRepository,
  )

  return createOrderUseCase
}

export { setupCreateOrderUseCase }
