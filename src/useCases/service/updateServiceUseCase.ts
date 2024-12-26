import { IServiceRepository } from '@/repositories/service/IServiceRepository'
import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'
import { OrderNotFoundError } from '@/errors/orderNotFoundError'
import { OrderStatusEnum, ServiceStatusEnum } from '@/enums/all.enum'

interface IUpdateServiceUseCaseRequest {
  id: string
  orderItemId: string
  employeeId?: string
  status?: string
  report?: string
}

class UpdateServiceUseCase {
  constructor(
    private serviceRepository: IServiceRepository,
    private orderItemRepository: IOrderItemRepository,
    private orderRepository: IOrderRepository,
    private employeeRepository: IEmployeeRepository,
  ) {}

  async execute({
    id,
    orderItemId,
    employeeId,
    status,
    report,
  }: IUpdateServiceUseCaseRequest) {
    const existingOrderItem =
      await this.orderItemRepository.findById(orderItemId)

    if (!existingOrderItem) {
      throw new OrderItemNotFoundError()
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

    const searchedOrder = await this.orderRepository.findById(
      existingOrderItem?.orderId,
    )

    if (!searchedOrder) {
      throw new OrderNotFoundError()
    }

    const orderServicesArray = searchedOrder.orderItems
      .filter((item) => item.service)
      .map((item) => item.service)

    if (
      orderServicesArray.length > 0 &&
      searchedOrder.status !== OrderStatusEnum.CANCELED &&
      searchedOrder.status !== OrderStatusEnum.AWAITING_SUPPLY
    ) {
      if (
        orderServicesArray.every(
          (service) => service?.status === ServiceStatusEnum.COMPLETED,
        ) &&
        searchedOrder.status !== OrderStatusEnum.COMPLETED
      ) {
        await this.orderRepository.updateById(existingOrderItem?.orderId, {
          status: OrderStatusEnum.COMPLETED,
        })
      } else {
        if (searchedOrder.status === OrderStatusEnum.COMPLETED) {
          await this.orderRepository.updateById(existingOrderItem?.orderId, {
            status: OrderStatusEnum.PENDING,
          })
        }
      }
    }

    return result
  }
}

export { UpdateServiceUseCase, IUpdateServiceUseCaseRequest }
