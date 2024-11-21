import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { IClientRepository } from '@/repositories/client/IClientRepository'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'

interface IUpdateOrderUseCaseRequest {
  id: string
  clientId?: string
  employeeId?: string
  type?: string
  status?: string
  payDate?: string
  paymentMethod?: string
  price?: number
  description?: string
  IMEI?: string
  paymentStatus?: string
  firstDueDate?: string
  dueDate?: number
  numberOfInstallments?: number
  interest?: number
}

class UpdateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private clientRepository: IClientRepository,
    private employeeRepository: IEmployeeRepository,
  ) {}

  async execute({
    id,
    clientId,
    employeeId,
    type,
    status,
    payDate,
    paymentMethod,
    price,
    description,
    IMEI,
    paymentStatus,
    firstDueDate,
    dueDate,
    numberOfInstallments,
    interest,
  }: IUpdateOrderUseCaseRequest) {
    if (clientId) {
      const clientExists = await this.clientRepository.findById(clientId)
      if (!clientExists) {
        throw new ClientNotFoundError()
      }
    }

    if (employeeId) {
      const employeeExists = await this.employeeRepository.findById(employeeId)
      if (!employeeExists) {
        throw new EmployeeNotFoundError()
      }
    }

    const updatedOrder = await this.orderRepository.updateById(id, {
      clientId,
      employeeId,
      type,
      status,
      payDate,
      paymentMethod,
      price,
      description,
      IMEI,
      paymentStatus,
      firstDueDate,
      dueDate,
      numberOfInstallments,
      interest,
    })

    return updatedOrder
  }
}

export { UpdateOrderUseCase, IUpdateOrderUseCaseRequest }
