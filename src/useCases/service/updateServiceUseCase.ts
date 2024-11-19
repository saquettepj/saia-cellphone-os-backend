import { IServiceRepository } from '@/repositories/service/IServiceRepository'
import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'

interface IUpdateServiceUseCaseRequest {
  id: string
  orderItemId?: string
  employeeId?: string
  status?: string
  report?: string
}

class UpdateServiceUseCase {
  constructor(
    private serviceRepository: IServiceRepository,
    private orderItemRepository: IOrderItemRepository,
    private employeeRepository: IEmployeeRepository,
  ) {}

  async execute({
    id,
    orderItemId,
    employeeId,
    status,
    report,
  }: IUpdateServiceUseCaseRequest) {
    if (orderItemId) {
      const existingOrderItem =
        await this.orderItemRepository.findById(orderItemId)

      if (!existingOrderItem) {
        throw new OrderItemNotFoundError()
      }
    }

    if (employeeId) {
      const existingEmployee =
        await this.employeeRepository.findById(employeeId)

      if (!existingEmployee) {
        throw new EmployeeNotFoundError()
      }
    }

    const result = await this.serviceRepository.updateById(id, {
      orderItemId,
      employeeId,
      status,
      report,
    })

    return result
  }
}

export { UpdateServiceUseCase, IUpdateServiceUseCaseRequest }
