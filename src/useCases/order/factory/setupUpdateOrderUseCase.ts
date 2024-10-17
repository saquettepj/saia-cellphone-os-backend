import { UpdateOrderUseCase } from '../updateOrderUseCase'

import { OrderRepository } from '@/repositories/order/orderRepository'
import { ClientRepository } from '@/repositories/client/clientRepository'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'

function setupUpdateOrderUseCase() {
  const orderRepository = new OrderRepository()
  const clientRepository = new ClientRepository()
  const employeeRepository = new EmployeeRepository()

  const updateOrderUseCase = new UpdateOrderUseCase(
    orderRepository,
    clientRepository,
    employeeRepository,
  )

  return updateOrderUseCase
}

export { setupUpdateOrderUseCase }
