import { IClientRepository } from '@/repositories/client/IClientRepository'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface ICreateOrderUseCaseRequest {
  companyId: string
  clientId: string
  employeeId: string
  number: number
  status: string
  payDate: string
  paymentMethod: string
  price: number
  description?: string
  orderItems: { productId: string; quantity: number }[]
  type: string
}

class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private clientRepository: IClientRepository,
    private employeeRepository: IEmployeeRepository,
    private productRepository: IProductRepository,
  ) {}

  async execute({
    companyId,
    clientId,
    employeeId,
    number,
    status,
    payDate,
    paymentMethod,
    price,
    description,
    orderItems,
    type,
  }: ICreateOrderUseCaseRequest) {
    const order = await this.orderRepository.create({
      companyId,
      clientId,
      employeeId,
      number,
      status,
      payDate,
      paymentMethod,
      price,
      description,
      orderItems,
      type,
    })

    return order
  }
}

export { CreateOrderUseCase, ICreateOrderUseCaseRequest }
