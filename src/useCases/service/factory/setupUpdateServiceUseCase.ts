import { UpdateServiceUseCase } from '../updateServiceUseCase'

import { ServiceRepository } from '@/repositories/service/serviceRepository'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { OrderItemRepository } from '@/repositories/orderItem/orderItemRepository'
import { OrderRepository } from '@/repositories/order/orderRepository'

function setupUpdateServiceUseCase() {
  const serviceRepository = new ServiceRepository()
  const orderItemRepository = new OrderItemRepository()
  const orderRepository = new OrderRepository()
  const employeeRepository = new EmployeeRepository()

  const updateServiceUseCase = new UpdateServiceUseCase(
    serviceRepository,
    orderItemRepository,
    orderRepository,
    employeeRepository,
  )

  return updateServiceUseCase
}

export { setupUpdateServiceUseCase }
