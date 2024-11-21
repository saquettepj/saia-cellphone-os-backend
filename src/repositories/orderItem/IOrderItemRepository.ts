import { OrderItem, Prisma } from '@prisma/client'

import { IOrderItem } from '../order/IOrderRepository'

export interface ICreateOrderItem
  extends Prisma.OrderItemUncheckedCreateWithoutServiceInput {
  service?: Prisma.ServiceUncheckedCreateWithoutOrderItemInput
}

interface IOrderItemRepository {
  findById(id: string): Promise<OrderItem | null>
  findManyByIds(ids: string[]): Promise<OrderItem[]>
  findManyByOrderId(orderId: string): Promise<OrderItem[]>
  findByOrderIdAndProductId(
    orderId: string,
    productId: string,
  ): Promise<OrderItem | null>
  create(data: ICreateOrderItem): Promise<IOrderItem>
  updateById(id: string, data: Prisma.OrderItemUpdateInput): Promise<OrderItem>
  delete(id: string): Promise<OrderItem | null>
  deleteMany(ids: string[]): Promise<number>
  deleteManyByOrderId(orderId: string): Promise<number>
}

export { IOrderItemRepository }
