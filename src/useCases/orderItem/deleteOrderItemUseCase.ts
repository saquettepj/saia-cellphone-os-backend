import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IDeleteOrderItemUseCaseRequest {
  id: string
}

interface IDeleteOrderItemUseCaseReturn {
  id: string
}

class DeleteOrderItemUseCase {
  constructor(
    private orderItemRepository: IOrderItemRepository,
    private productRepository: IProductRepository,
  ) {}

  async execute({
    id,
  }: IDeleteOrderItemUseCaseRequest): Promise<IDeleteOrderItemUseCaseReturn> {
    const orderItem = await this.orderItemRepository.findById(id)
    if (!orderItem) {
      throw new OrderItemNotFoundError()
    }

    const product = await this.productRepository.findById(orderItem.productId)
    if (!product) {
      throw new ProductNotFoundError()
    }

    const maxQuantity = orderItem.initialQuantity
    const newProductQuantity = Math.min(
      product.quantity + orderItem.quantity,
      maxQuantity,
    )

    await this.productRepository.updateById(product.id, {
      quantity: newProductQuantity,
    })

    await this.orderItemRepository.delete(id)

    return { id }
  }
}

export { DeleteOrderItemUseCase, IDeleteOrderItemUseCaseRequest }
