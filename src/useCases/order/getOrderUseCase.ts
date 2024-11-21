import { IOrderRepository } from '@/repositories/order/IOrderRepository'

interface IGetOrdersUseCaseRequest {
  companyId: string
  IMEI?: string
  clientId?: string
  employeeId?: string
  number?: number
  type?: string
  status?: string
  payDate?: string
  paymentMethod?: string
  paymentStatus?: string
  dueDate?: number
  numberOfInstallments?: number
  interest?: number
  price?: number
  description?: string
}

class GetOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute({
    companyId,
    IMEI,
    clientId,
    employeeId,
    number,
    type,
    status,
    payDate,
    paymentMethod,
    paymentStatus,
    dueDate,
    numberOfInstallments,
    interest,
    price,
    description,
  }: IGetOrdersUseCaseRequest) {
    const searchedOrders = await this.orderRepository.findAllByCompanyId(
      companyId,
      {
        clientId,
        IMEI,
        employeeId,
        number,
        type,
        status,
        payDate,
        paymentMethod,
        paymentStatus,
        dueDate,
        numberOfInstallments,
        interest,
        price,
        description,
      },
    )

    return searchedOrders
  }
}

export { GetOrderUseCase, IGetOrdersUseCaseRequest }
