import { PaymentStatusEnum } from '@/enums/all.enum'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface ICreateOrderItemOnOrderRequest {
  productId: string
  quantity: number
  discount?: number
  service?: { employeeId?: string | null }
}

interface ICreateOrderUseCaseRequest {
  companyId: string
  IMEI?: string
  type: string
  clientId: string
  employeeId: string
  status: string
  description?: string
  payDate?: string
  paymentMethod: string
  paymentStatus: string
  firstDueDate?: string
  dueDate?: number
  numberOfInstallments?: number
  interest?: number
  orderItems: ICreateOrderItemOnOrderRequest[]
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
    description,
    firstDueDate,
    dueDate,
    numberOfInstallments,
    interest,
    orderItems,
    type,
  }: ICreateOrderUseCaseRequest) {
    const orderItemsWithInitialQuantity = []
    let orderPrice = 0

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

      const itemTotal =
        ((product.price || 0) - (item.discount || 0)) * item.quantity

      orderPrice += Math.max(0, itemTotal)

      orderItemsWithInitialQuantity.push({
        productId: item.productId,
        registeredProductPrice: product.price,
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
      price: orderPrice,
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
