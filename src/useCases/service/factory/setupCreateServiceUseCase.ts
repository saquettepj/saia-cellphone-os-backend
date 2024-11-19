import { CreateServiceUseCase } from '../createServiceUseCase'

import { ServiceRepository } from '@/repositories/service/serviceRepository'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { OrderItemRepository } from '@/repositories/orderItem/orderItemRepository'

function setupCreateServiceUseCase() {
  const serviceRepository = new ServiceRepository()
  const orderItemRepository = new OrderItemRepository()
  const employeeRepository = new EmployeeRepository()

  const createServiceUseCase = new CreateServiceUseCase(
    serviceRepository,
    orderItemRepository,
    employeeRepository,
  )

  return createServiceUseCase
}

export { setupCreateServiceUseCase }
