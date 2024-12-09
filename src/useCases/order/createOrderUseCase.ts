import { PaymentStatusEnum } from '@/enums/all.enum'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface ICreateOrderUseCaseRequest {
  companyId: string
  IMEI?: string
  type: string
  clientId: string
  employeeId: string
  status: string
  description?: string
  price: number
  payDate?: string
  paymentMethod: string
  paymentStatus: string
  firstDueDate?: string
  dueDate?: number
  numberOfInstallments?: number
  interest?: number
  orderItems: {
    productId: string
    quantity: number
    discount?: number
    service?: { employeeId?: string | null }
  }[]
}

class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private employeeRepository: IEmployeeRepository,
  ) {}

  async execute({
    companyId,
    IMEI,
    clientId,
    employeeId,
    status,
    payDate,
    paymentMethod,
    paymentStatus,
    price,
    description,
    firstDueDate,
    dueDate,
    numberOfInstallments,
    interest,
    orderItems,
    type,
  }: ICreateOrderUseCaseRequest) {
    const orderItemsWithInitialQuantity = []

    for (const item of orderItems) {
      const product = await this.productRepository.findById(item.productId)
      if (!product) {
        throw new ProductNotFoundError()
      }

      if (item.service?.employeeId) {
        const serviceEmployeeExists = await this.employeeRepository.findById(
          item.service.employeeId,
        )
        if (!serviceEmployeeExists) {
          throw new EmployeeNotFoundError()
        }
      }

      const newQuantity = Math.max(product.quantity - item.quantity, 0)

      await this.productRepository.updateById(item.productId, {
        quantity: newQuantity,
      })

      orderItemsWithInitialQuantity.push({
        productId: item.productId,
        quantity: item.quantity,
        initialQuantity: product.quantity,
        discount: item.discount,
        service: {
          employeeId: item.service?.employeeId,
        },
      })
    }

    const closingDate =
      paymentStatus === PaymentStatusEnum.FULFILLED ? new Date() : null

    const order = await this.orderRepository.create({
      companyId,
      IMEI,
      clientId,
      employeeId,
      status,
      payDate,
      paymentMethod,
      paymentStatus,
      price,
      description,
      closingDate,
      firstDueDate,
      dueDate,
      numberOfInstallments,
      interest,
      orderItems: orderItemsWithInitialQuantity,
      type,
    })

    return order
  }
}

export { CreateOrderUseCase, ICreateOrderUseCaseRequest }
