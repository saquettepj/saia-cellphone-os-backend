import { CreateOrderItemUseCase } from '../createOrderItemUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { OrderItemRepository } from '@/repositories/orderItem/orderItemRepository'

function setupCreateOrderItemUseCase() {
  const orderItemRepository = new OrderItemRepository()
  const productRepository = new ProductRepository()
  const employeeRepository = new EmployeeRepository()

  const createOrderItemUseCase = new CreateOrderItemUseCase(
    orderItemRepository,
    productRepository,
    employeeRepository,
  )

  return createOrderItemUseCase
}

export { setupCreateOrderItemUseCase }
