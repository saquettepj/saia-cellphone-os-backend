import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { IClientRepository } from '@/repositories/client/IClientRepository'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'

interface IUpdateOrderUseCaseRequest {
  id: string
  companyId: string
  clientId?: string
  employeeId?: string
  number?: number
  type?: string
  status?: string
  payDate?: string
  paymentMethod?: string
  price?: number
  description?: string
}

class UpdateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private clientRepository: IClientRepository,
    private employeeRepository: IEmployeeRepository,
  ) {}

  async execute({
    id,
    companyId,
    clientId,
    employeeId,
    number,
    type,
    status,
    payDate,
    paymentMethod,
    price,
    description,
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
      companyId,
      clientId,
      employeeId,
      number,
      type,
      status,
      payDate,
      paymentMethod,
      price,
      description,
    })

    return updatedOrder
  }
}

export { UpdateOrderUseCase, IUpdateOrderUseCaseRequest }
