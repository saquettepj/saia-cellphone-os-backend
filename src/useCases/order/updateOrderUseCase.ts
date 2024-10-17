import { IClientRepository } from '@/repositories/client/IClientRepository'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IUpdateOrderUseCaseRequest {
  id: string
  companyId: string
  clientId?: string
  employeeId?: string
  number?: number
  type?: string
  status?: string
  payDate?: Date
  paymentMethod?: string
  price?: number
  description?: string
}

class UpdateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private clientRepository: IClientRepository,
    private employeeRepository: IEmployeeRepository,
    private productRepository: IProductRepository,
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
