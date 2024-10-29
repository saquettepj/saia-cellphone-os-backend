import { DeletingError } from '@/errors/deletingError'
import { OrderNotFoundError } from '@/errors/orderNotFoundError'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'
import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IDeleteOrderUseCaseRequest {
  id: string
}

class DeleteOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private orderItemRepository: IOrderItemRepository,
    private productRepository: IProductRepository,
  ) {}

  async execute({ id }: IDeleteOrderUseCaseRequest) {
    const searchedOrder = await this.orderRepository.findById(id)

    if (!searchedOrder) {
      throw new OrderNotFoundError()
    }

    try {
      const orderItems = await this.orderItemRepository.findManyByOrderId(id)

      for (const item of orderItems) {
        const product = await this.productRepository.findById(item.productId)
        if (product) {
          const updatedQuantity = product.quantity + item.quantity
          await this.productRepository.updateById(product.id, {
            quantity: updatedQuantity,
          })
        }
      }

      await this.orderItemRepository.deleteManyByOrderId(id)

      const result = await this.orderRepository.delete(id)

      return result
    } catch (error) {
      throw new DeletingError()
    }
  }
}

export { DeleteOrderUseCase, IDeleteOrderUseCaseRequest }
