import { PaymentMethodEnum, ProductTypeEnum } from '@/enums/all.enum'
import { ClientNotFoundError } from '@/errors/clientNotFoundError'
import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { IClientRepository } from '@/repositories/client/IClientRepository'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'
import { ITransaction } from '@/utils/transaction'

interface IUpdateOrderItemRequest {
  id?: string
  productId?: string
  quantity?: number
  discount?: number
  service?: { id?: string; employeeId?: string | null }
}

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
  orderItems?: IUpdateOrderItemRequest[]
}

class UpdateOrderUseCase {
  constructor(
    private transactionService: ITransaction,
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
    description,
    IMEI,
    paymentStatus,
    firstDueDate,
    dueDate,
    numberOfInstallments,
    interest,
    orderItems,
  }: IUpdateOrderUseCaseRequest) {
    return this.transactionService.run(async (transaction) => {
      if (clientId) {
        const clientExists = await this.clientRepository.findById(clientId)
        if (!clientExists) {
          throw new ClientNotFoundError()
        }
      }

      if (employeeId) {
        const employeeExists =
          await this.employeeRepository.findById(employeeId)
        if (!employeeExists) {
          throw new EmployeeNotFoundError()
        }
      }

      const productIdsInRequest = new Set<string>()
      for (const item of orderItems || []) {
        if (item.productId) {
          if (productIdsInRequest.has(item.productId)) {
            throw new DuplicateOrderItemError()
          }
          productIdsInRequest.add(item.productId)
        }
      }

      await transaction.order.update({
        where: { id },
        data: {
          clientId,
          employeeId,
          type,
          status,
          payDate:
            paymentMethod === PaymentMethodEnum.INSTALLMENTS ? null : payDate,
          paymentMethod,
          description,
          IMEI,
          paymentStatus,
          firstDueDate:
            paymentMethod !== PaymentMethodEnum.INSTALLMENTS
              ? null
              : firstDueDate,
          dueDate:
            paymentMethod !== PaymentMethodEnum.INSTALLMENTS ? null : dueDate,
          numberOfInstallments:
            paymentMethod !== PaymentMethodEnum.INSTALLMENTS
              ? null
              : numberOfInstallments,
          interest:
            paymentMethod !== PaymentMethodEnum.INSTALLMENTS ? null : interest,
        },
      })

      if (orderItems) {
        const existingItems = await transaction.orderItem.findMany({
          where: { orderId: id },
        })

        const existingItemsByProductId = new Map(
          existingItems.map((item) => [item.productId, item]),
        )

        const itemsToCreate = []
        const itemsToDelete = []
        const itemsToUpdate = []

        for (const existingItem of existingItems) {
          const matchingItem = orderItems.find(
            (item) => item.productId === existingItem.productId,
          )
          if (!matchingItem) {
            itemsToDelete.push(existingItem)
          }
        }

        for (const orderItem of orderItems) {
          const existingItem = existingItemsByProductId.get(
            orderItem.productId!,
          )

          if (existingItem) {
            if (!orderItem.id) {
              itemsToDelete.push(existingItem)
              itemsToCreate.push(orderItem)
            } else {
              itemsToUpdate.push({ existingItem, orderItem })
            }
          } else {
            itemsToCreate.push(orderItem)
          }
        }

        for (const itemToDelete of itemsToDelete) {
          const product = await transaction.product.findUnique({
            where: { id: itemToDelete.productId },
          })
          if (!product) throw new ProductNotFoundError()

          const maxQuantity = itemToDelete.initialQuantity
          const newProductQuantity = Math.min(
            product.quantity + itemToDelete.quantity,
            maxQuantity,
          )

          await transaction.product.update({
            where: { id: product.id },
            data: { quantity: newProductQuantity },
          })

          await transaction.orderItem.delete({
            where: { id: itemToDelete.id },
          })
        }

        for (const { existingItem, orderItem } of itemsToUpdate) {
          const quantityDifference =
            (orderItem.quantity || 0) - existingItem.quantity

          const product = await transaction.product.findUnique({
            where: { id: existingItem.productId },
          })
          if (!product) throw new ProductNotFoundError()

          if (quantityDifference !== 0) {
            if (quantityDifference > 0) {
              const newProductQuantity = Math.max(
                product.quantity - quantityDifference,
                0,
              )
              await transaction.product.update({
                where: { id: product.id },
                data: { quantity: newProductQuantity },
              })
            } else {
              const maxQuantity = existingItem.initialQuantity
              const newProductQuantity = Math.min(
                product.quantity + Math.abs(quantityDifference),
                maxQuantity,
              )
              await transaction.product.update({
                where: { id: product.id },
                data: { quantity: newProductQuantity },
              })
            }
          }

          await transaction.orderItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: orderItem.quantity,
              discount: orderItem.discount,
              service:
                product.type !== ProductTypeEnum.PRODUCT && orderItem.service
                  ? {
                      upsert: {
                        create: { employeeId: orderItem.service.employeeId },
                        update: { employeeId: orderItem.service.employeeId },
                      },
                    }
                  : undefined,
            },
          })
        }

        for (const newItem of itemsToCreate) {
          const product = await transaction.product.findUnique({
            where: { id: newItem.productId },
          })
          if (!product) throw new ProductNotFoundError()

          const newQuantity = Math.max(
            product.quantity - (newItem.quantity || 1)!,
            0,
          )

          await transaction.product.update({
            where: { id: newItem.productId! },
            data: { quantity: newQuantity },
          })

          await transaction.orderItem.create({
            data: {
              orderId: id,
              productId: newItem.productId!,
              registeredProductPrice: product.price,
              quantity: newItem.quantity || 1,
              initialQuantity: product.quantity,
              discount: newItem.discount,
              service:
                product.type !== ProductTypeEnum.PRODUCT && newItem.service
                  ? {
                      create: { employeeId: newItem.service.employeeId },
                    }
                  : undefined,
            },
          })
        }
      }

      const fullOrder = await transaction.order.findUnique({
        where: { id },
        include: {
          orderItems: {
            include: {
              service: true,
            },
          },
        },
      })

      return fullOrder
    })
  }
}

export { UpdateOrderUseCase, IUpdateOrderUseCaseRequest }
