import { DeletingError } from '@/errors/deletingError'
import { OrderNotFoundError } from '@/errors/orderNotFoundError'
import { ITransaction } from '@/utils/transaction'

interface IDeleteOrderUseCaseRequest {
  id: string
}

class DeleteOrderUseCase {
  constructor(private transactionService: ITransaction) {}

  async execute({ id }: IDeleteOrderUseCaseRequest) {
    return this.transactionService.run(async (transaction) => {
      const searchedOrder = await transaction.order.findUnique({
        where: { id },
      })

      if (!searchedOrder) {
        throw new OrderNotFoundError()
      }

      try {
        const orderItems = await transaction.orderItem.findMany({
          where: { orderId: id },
        })

        for (const item of orderItems) {
          const product = await transaction.product.findUnique({
            where: { id: item.productId },
          })
          if (product) {
            const updatedQuantity = product.quantity + item.quantity
            await transaction.product.update({
              where: { id: product.id },
              data: { quantity: updatedQuantity },
            })
          }
        }

        await transaction.orderItem.deleteMany({
          where: { orderId: id },
        })

        const result = await transaction.order.delete({
          where: { id },
        })

        return result
      } catch (error) {
        throw new DeletingError()
      }
    })
  }
}

export { DeleteOrderUseCase, IDeleteOrderUseCaseRequest }
