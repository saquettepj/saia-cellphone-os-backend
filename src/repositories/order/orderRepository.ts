import { Prisma } from '@prisma/client'

import { ICreateOrder, IOrder, IOrderRepository } from './IOrderRepository'

import { prisma } from '@/app'

class OrderRepository implements IOrderRepository {
  async findById(id: string): Promise<IOrder | null> {
    const searchedOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    })
    return searchedOrder
  }

  async findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.OrderCreateManyInput> & { productIds?: string[] },
  ): Promise<IOrder[]> {
    const searchedOrders = await prisma.order.findMany({
      where: {
        companyId,
        ...(data.clientId && { clientId: { contains: data.clientId } }),
        ...(data.employeeId && { employeeId: { contains: data.employeeId } }),
        ...(data.number && { number: data.number }),
        ...(data.type && { type: { contains: data.type } }),
        ...(data.status && { status: { contains: data.status } }),
        ...(data.payDate && { payDate: data.payDate }),
        ...(data.paymentMethod && {
          paymentMethod: { contains: data.paymentMethod },
        }),
        ...(data.price && { price: data.price }),
        ...(data.description && {
          description: { contains: data.description },
        }),
        ...(data.productIds && {
          orderItems: {
            some: {
              productId: { in: data.productIds },
            },
          },
        }),
      },
      include: {
        orderItems: true,
      },
    })

    return searchedOrders
  }

  async updateById(id: string, data: Prisma.OrderUpdateInput) {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data,
      include: {
        orderItems: true,
      },
    })
    return updatedOrder
  }

  async delete(id: string) {
    const deletedOrder = await prisma.order.delete({
      where: { id },
      include: {
        orderItems: true,
      },
    })
    return deletedOrder
  }

  async deleteMany(ids: string[]) {
    const deletedOrders = await prisma.order.deleteMany({
      where: { id: { in: ids } },
    })

    return deletedOrders.count
  }

  async create(data: ICreateOrder) {
    const createdOrder = await prisma.order.create({
      data: {
        ...data,
        orderItems: {
          create: data.orderItems?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            initialQuantity: item.initialQuantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })
    return createdOrder
  }
}

export { OrderRepository }
