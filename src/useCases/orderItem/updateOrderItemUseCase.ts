import { OrderItemNotFoundError } from '@/errors/orderItemNotFoundError'
import { ProductNotFoundError } from '@/errors/productNotFoundError'
import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'
import { IProductRepository } from '@/repositories/product/IProductRepository'

interface IUpdateOrderItemUseCaseRequest {
  id: string
  quantity?: number
}

class UpdateOrderItemUseCase {
  constructor(
    private orderItemRepository: IOrderItemRepository,
    private productRepository: IProductRepository,
  ) {}

  async execute({ id, quantity }: IUpdateOrderItemUseCaseRequest) {
    const orderItem = await this.orderItemRepository.findById(id)
    if (!orderItem) {
      throw new OrderItemNotFoundError()
    }

    const product = await this.productRepository.findById(orderItem.productId)
    if (!product) {
      throw new ProductNotFoundError()
    }

    if (quantity !== undefined) {
      const quantityDifference = quantity - orderItem.quantity

      if (quantityDifference > 0) {
        const newProductQuantity = Math.max(
          product.quantity - quantityDifference,
          0,
        )
        await this.productRepository.updateById(product.id, {
          quantity: newProductQuantity,
        })
      } else if (quantityDifference < 0) {
        const maxQuantity = orderItem.initialQuantity
        const newProductQuantity = Math.min(
          product.quantity + Math.abs(quantityDifference),
          maxQuantity,
        )
        await this.productRepository.updateById(product.id, {
          quantity: newProductQuantity,
        })
      }
    }

    const updatedOrderItem = await this.orderItemRepository.updateById(id, {
      quantity,
    })

    return updatedOrderItem
  }
}

export { UpdateOrderItemUseCase, IUpdateOrderItemUseCaseRequest }
