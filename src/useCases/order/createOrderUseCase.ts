import { PaymentStatusEnum, ProductTypeEnum } from '@/enums/all.enum'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { ITransaction } from '@/utils/transaction'

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
  amountPaid?: number
  orderItems: ICreateOrderItemOnOrderRequest[]
}

class CreateOrderUseCase {
  constructor(
    private transactionService: ITransaction,
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
    amountPaid,
    orderItems,
    type,
  }: ICreateOrderUseCaseRequest) {
    return this.transactionService.run(async (transaction) => {
      const productIdsInRequest = new Set<string>()
      for (const item of orderItems) {
        if (productIdsInRequest.has(item.productId)) {
          throw new DuplicateOrderItemError()
        }
        productIdsInRequest.add(item.productId)
      }

      const order = await transaction.order.create({
        data: {
          companyId,
          IMEI,
          clientId,
          employeeId,
          status,
          payDate,
          paymentMethod,
          paymentStatus,
          price: 0,
          description,
          closingDate:
            paymentStatus === PaymentStatusEnum.FULFILLED ? new Date() : null,
          firstDueDate,
          dueDate,
          numberOfInstallments,
          interest,
          amountPaid,
          type,
        },
      })

      let totalOrderPrice = 0

      for (const item of orderItems) {
        const product = await transaction.product.findUnique({
          where: { id: item.productId },
        })

        if (!product) {
          throw new ProductNotFoundError()
        }

        if (item.service?.employeeId) {
          const employeeExists = await this.employeeRepository.findById(
            item.service.employeeId,
          )
          if (!employeeExists) {
            throw new EmployeeNotFoundError()
          }
        }

        const newQuantity = Math.max(product.quantity - item.quantity, 0)

        await transaction.product.update({
          where: { id: item.productId },
          data: { quantity: newQuantity },
        })

        const itemTotal =
          ((product.price || 0) - (item.discount || 0)) * item.quantity

        totalOrderPrice += Math.max(0, itemTotal)

        await transaction.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            registeredProductPrice: product.price,
            quantity: item.quantity,
            initialQuantity: product.quantity,
            discount: item.discount,
            service:
              product.type !== ProductTypeEnum.PRODUCT && item.service
                ? {
                    create: { employeeId: item.service.employeeId },
                  }
                : undefined,
          },
        })
      }

      await transaction.order.update({
        where: { id: order.id },
        data: { price: totalOrderPrice },
      })

      return transaction.order.findUnique({
        where: { id: order.id },
        include: {
          orderItems: {
            include: {
              service: true,
            },
          },
        },
      })
    })
  }
}

export { CreateOrderUseCase, ICreateOrderUseCaseRequest }
