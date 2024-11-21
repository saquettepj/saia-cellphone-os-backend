import { CreateOrderUseCase } from '../createOrderUseCase'

import { EmployeeRepository } from '@/repositories/employee/employeeRepository'
import { OrderRepository } from '@/repositories/order/orderRepository'
import { ProductRepository } from '@/repositories/product/productRepository'

function setupCreateOrderUseCase() {
  const orderRepository = new OrderRepository()
  const productRepository = new ProductRepository()
  const employeeRepository = new EmployeeRepository()

  const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    productRepository,
    employeeRepository,
  )

  return createOrderUseCase
}

export { setupCreateOrderUseCase }
