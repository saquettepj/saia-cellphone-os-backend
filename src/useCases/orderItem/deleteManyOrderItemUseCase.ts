import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IDeleteManyOrderItemUseCaseRequest {
  ids: string[]
}

class DeleteManyOrderItemUseCase {
  constructor(
    private orderItemRepository: IOrderItemRepository,
    private productRepository: IProductRepository,
  ) {}

  async execute({ ids }: IDeleteManyOrderItemUseCaseRequest) {
    const orderItems = await this.orderItemRepository.findManyByIds(ids)

    if (orderItems.length !== ids.length) {
      throw new OrderItemNotFoundError()
    }

    for (const orderItem of orderItems) {
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
    }

    const deletedOrderItemsCount =
      await this.orderItemRepository.deleteMany(ids)

    return deletedOrderItemsCount
  }
}

export { DeleteManyOrderItemUseCase, IDeleteManyOrderItemUseCaseRequest }
