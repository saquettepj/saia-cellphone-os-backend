import { OrderItem, Prisma } from '@prisma/client'

interface IOrderItemRepository {
  findById(id: string): Promise<OrderItem | null>
  findManyByIds(ids: string[]): Promise<OrderItem[]>
  findManyByOrderId(orderId: string): Promise<OrderItem[]>
  findByOrderIdAndProductId(
    orderId: string,
    productId: string,
  ): Promise<OrderItem | null>
  create(data: Prisma.OrderItemUncheckedCreateInput): Promise<OrderItem>
  updateById(id: string, data: Prisma.OrderItemUpdateInput): Promise<OrderItem>
  delete(id: string): Promise<OrderItem | null>
  deleteMany(ids: string[]): Promise<number>
  deleteManyByOrderId(orderId: string): Promise<number>
}

export { IOrderItemRepository }
