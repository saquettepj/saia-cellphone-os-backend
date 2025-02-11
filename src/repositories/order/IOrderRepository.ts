import {
  Nfce,
  Order,
  OrderItem,
  Prisma,
  Product,
  Service,
} from '@prisma/client'

export interface IOrderItem extends OrderItem {
  service?: Service | null
  product?: Product
}

interface IOrder extends Order {
  orderItems: IOrderItem[]
  nfce?: Nfce | null
}

export interface ICreateOrder
  extends Prisma.OrderUncheckedCreateWithoutOrderItemsInput {
  orderItems?: Array<
    Prisma.OrderItemUncheckedCreateWithoutOrderInput & {
      service?: Prisma.ServiceUncheckedCreateWithoutOrderItemInput
    }
  >
}

interface IOrderRepository {
  findById(id: string): Promise<IOrder | null>
  findAllById(id: string): Promise<IOrder | null>
  findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.OrderCreateManyInput>,
  ): Promise<IOrder[]>
  updateById(
    id: string,
    data: Prisma.OrderUncheckedUpdateWithoutOrderItemsInput,
  ): Promise<Order>
  delete(id: string): Promise<IOrder>
  deleteMany(ids: string[]): Promise<number>
  create(data: ICreateOrder): Promise<IOrder>
}

export { IOrderRepository, IOrder }
