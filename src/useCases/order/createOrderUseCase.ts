import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface ICreateOrderUseCaseRequest {
  companyId: string
  clientId: string
  employeeId: string
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
    private productRepository: IProductRepository,
  ) {}

  async execute({
    companyId,
    clientId,
    employeeId,
    status,
    payDate,
    paymentMethod,
    price,
    description,
    orderItems,
    type,
  }: ICreateOrderUseCaseRequest) {
    const orderItemsWithInitialQuantity = []

    for (const item of orderItems) {
      const product = await this.productRepository.findById(item.productId)
      if (!product) {
        throw new ProductNotFoundError()
      }

      const newQuantity = Math.max(product.quantity - item.quantity, 0)

      await this.productRepository.updateById(item.productId, {
        quantity: newQuantity,
      })

      orderItemsWithInitialQuantity.push({
        productId: item.productId,
        quantity: item.quantity,
        initialQuantity: product.quantity,
      })
    }

    const order = await this.orderRepository.create({
      companyId,
      clientId,
      employeeId,
      status,
      payDate,
      paymentMethod,
      price,
      description,
      orderItems: orderItemsWithInitialQuantity,
      type,
    })

    return order
  }
}

export { CreateOrderUseCase, ICreateOrderUseCaseRequest }
