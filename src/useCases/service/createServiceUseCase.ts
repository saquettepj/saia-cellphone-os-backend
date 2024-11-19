import { IServiceRepository } from '@/repositories/service/IServiceRepository'
import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

interface ICreateServiceUseCaseRequest {
  orderItemId: string
  employeeId: string
  status: string
  report?: string | null
}

class CreateServiceUseCase {
  constructor(
    private serviceRepository: IServiceRepository,
    private orderItemRepository: IOrderItemRepository,
    private employeeRepository: IEmployeeRepository,
  ) {}

  async execute({
    orderItemId,
    employeeId,
    status,
    report,
  }: ICreateServiceUseCaseRequest) {
    const searchedOrderItem =
      await this.orderItemRepository.findById(orderItemId)

    if (!searchedOrderItem) {
      throw new OrderItemNotFoundError()
    }

    const searchedEmployee = await this.employeeRepository.findById(employeeId)

    if (!searchedEmployee) {
      throw new EmployeeNotFoundError()
    }

    const createdService = await this.serviceRepository.create({
      orderItemId,
      employeeId,
      status,
      report,
    })

    return createdService
  }
}

export { CreateServiceUseCase, ICreateServiceUseCaseRequest }
