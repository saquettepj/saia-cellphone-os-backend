import { DuplicateOrderItemError } from '@/errors/duplicateOrderItemError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface ICreateOrderItemUseCaseRequest {
  orderId: string
  productId: string
  quantity: number
}

class CreateOrderItemUseCase {
  constructor(
    private orderItemRepository: IOrderItemRepository,
    private productRepository: IProductRepository,
  ) {}

  async execute({
    orderId,
    productId,
    quantity,
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

    const newQuantity = Math.max(product.quantity - quantity, 0)

    await this.productRepository.updateById(productId, {
      quantity: newQuantity,
    })

    const orderItem = await this.orderItemRepository.create({
      orderId,
      productId,
      quantity,
      initialQuantity: product.quantity,
    })

    return orderItem
  }
}

export { CreateOrderItemUseCase, ICreateOrderItemUseCaseRequest }
