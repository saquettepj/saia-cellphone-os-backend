import { DeletingError } from '@/errors/deletingError'
import { OrderNotFoundError } from '@/errors/orderNotFoundError'
import { IOrderRepository } from '@/repositories/order/IOrderRepository'

interface IDeleteOrderUseCaseRequest {
  id: string
}

class DeleteOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute({ id }: IDeleteOrderUseCaseRequest) {
    const searchedOrder = await this.orderRepository.findById(id)

    if (!searchedOrder) {
      throw new OrderNotFoundError()
    }

    try {
      await this.orderRepository.delete(id)
    } catch (error) {
      throw new DeletingError()
    }
  }
}

export { DeleteOrderUseCase, IDeleteOrderUseCaseRequest }
