import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { EmployeeNotFoundError } from '@/errors/employeeNotFoundError'
import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'
import { IEmployeeRepository } from '@/repositories/employee/IEmployeeRepository'

interface ICreateOrderItemUseCaseRequest {
  orderId: string
  productId: string
  quantity: number
  discount?: number
  service?: {
    employeeId: string
  }
}

class CreateOrderItemUseCase {
  constructor(
    private orderItemRepository: IOrderItemRepository,
    private productRepository: IProductRepository,
    private employeeRepository: IEmployeeRepository,
  ) {}

  async execute({
    orderId,
    productId,
    quantity,
    discount,
    service,
  }: ICreateOrderItemUseCaseRequest) {
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new ProductNotFoundError()
    }

    const existingOrderItem =
      await this.orderItemRepository.findByOrderIdAndProductId(
        orderId,
        productId,
      )
    if (existingOrderItem) {
      throw new DuplicateOrderItemError()
    }

    if (service?.employeeId) {
      const employeeExists = await this.employeeRepository.findById(
        service.employeeId,
      )
      if (!employeeExists) {
        throw new EmployeeNotFoundError()
      }
    }

    const newQuantity = Math.max(product.quantity - quantity, 0)

    await this.productRepository.updateById(productId, {
      quantity: newQuantity,
    })

    const orderItem = await this.orderItemRepository.create({
      orderId,
      productId,
      quantity,
      initialQuantity: product.quantity,
      discount,
      service: service
        ? {
            employeeId: service.employeeId,
          }
        : undefined,
    })

    return orderItem
  }
}

export { CreateOrderItemUseCase, ICreateOrderItemUseCaseRequest }
