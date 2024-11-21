import { CreateOrderItemUseCase } from '../createOrderItemUseCase'

import { ProductRepository } from '@/repositories/product/productRepository'
import { OrderItemRepository } from '@/repositories/orderItem/orderItemRepository'
import { EmployeeRepository } from '@/repositories/employee/employeeRepository'

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
