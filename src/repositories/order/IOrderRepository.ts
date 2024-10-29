import { Order, OrderItem, Prisma } from '@prisma/client'

interface IOrder extends Order {
  orderItems: OrderItem[]
}

export interface ICreateOrder
  extends Prisma.OrderUncheckedCreateWithoutOrderItemsInput {
  orderItems?: Prisma.OrderItemUncheckedCreateWithoutOrderInput[]
}

interface IOrderRepository {
  findById(id: string): Promise<IOrder | null>
  findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.OrderCreateManyInput> & { productIds?: string[] },
  ): Promise<IOrder[]>
  updateById(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<Order>
  delete(id: string): Promise<IOrder>
  deleteMany(ids: string[]): Promise<number>
  create(data: ICreateOrder): Promise<IOrder>
}

export { IOrderRepository, IOrder }
