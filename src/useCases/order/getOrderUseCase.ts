import { IOrderRepository } from '@/repositories/order/IOrderRepository'

interface IGetOrdersUseCaseRequest {
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
  orderItems?: Array<{ productId: string }>
}

class GetOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute({
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
    orderItems,
  }: IGetOrdersUseCaseRequest) {
    const productIds = orderItems?.map((item) => item.productId)

    const searchedOrders = await this.orderRepository.findAllByCompanyId(
      companyId,
      {
        clientId,
        employeeId,
        number,
        type,
        status,
        payDate,
        paymentMethod,
        price,
        description,
        productIds,
      },
    )

    return searchedOrders
  }
}

export { GetOrderUseCase }
