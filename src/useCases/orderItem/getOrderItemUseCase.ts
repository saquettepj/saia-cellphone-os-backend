import { IOrderItemRepository } from '@/repositories/orderItem/IOrderItemRepository'

interface IGetOrderItemsUseCaseRequest {
  id?: string
  orderId?: string
  productId?: string
  discount?: number
  quantity?: number
}

class GetOrderItemUseCase {
  constructor(private orderItemRepository: IOrderItemRepository) {}

  async execute({
    id,
    orderId,
    productId,
    discount,
    quantity,
  }: IGetOrderItemsUseCaseRequest) {
    const searchCriteria = {
      ...(id && { id }),
      ...(orderId && { orderId }),
      ...(productId && { productId }),
      ...(discount && { discount }),
      ...(quantity && { quantity }),
    }

    const searchedOrderItems = await this.orderItemRepository.findManyByOrderId(
      orderId || '',
    )

    return searchedOrderItems.filter((orderItem) =>
      Object.entries(searchCriteria).every(
        ([key, value]) => orderItem[key as keyof typeof orderItem] === value,
      ),
    )
  }
}

export { GetOrderItemUseCase }
