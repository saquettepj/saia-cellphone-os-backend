import { UpdateServiceUseCase } from '../updateServiceUseCase'

import { ServiceRepository } from '@/repositories/service/serviceRepository'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { OrderItemRepository } from '@/repositories/orderItem/orderItemRepository'

function setupUpdateServiceUseCase() {
  const serviceRepository = new ServiceRepository()
  const orderItemRepository = new OrderItemRepository()
  const employeeRepository = new EmployeeRepository()

  const updateServiceUseCase = new UpdateServiceUseCase(
    serviceRepository,
    orderItemRepository,
    employeeRepository,
  )

  return updateServiceUseCase
}

export { setupUpdateServiceUseCase }
