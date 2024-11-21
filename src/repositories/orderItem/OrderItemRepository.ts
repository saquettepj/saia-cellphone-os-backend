import { Prisma } from '@prisma/client'

import { ICreateOrderItem, IOrderItemRepository } from './IOrderItemRepository'

import { prisma } from '@/app'

class OrderItemRepository implements IOrderItemRepository {
  async findById(id: string) {
    return await prisma.orderItem.findUnique({ where: { id } })
  }

  async findManyByIds(ids: string[]) {
    return await prisma.orderItem.findMany({
      where: { id: { in: ids } },
    })
  }

  async findByOrderIdAndProductId(orderId: string, productId: string) {
    return await prisma.orderItem.findFirst({
      where: {
        orderId,
        productId,
      },
    })
  }

  async findManyByOrderId(orderId: string) {
    return await prisma.orderItem.findMany({
      where: { orderId },
    })
  }

  async create(data: ICreateOrderItem) {
    const createdOrderItem = await prisma.orderItem.create({
      data: {
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        initialQuantity: data.initialQuantity,
        discount: data.discount,
        service: data.service
          ? {
              create: {
                employeeId: data.service.employeeId,
              },
            }
          : undefined,
      },
      include: {
        service: true,
      },
    })

    return {
      ...createdOrderItem,
      service: createdOrderItem.service || undefined,
    }
  }

  async updateById(id: string, data: Prisma.OrderItemUpdateInput) {
    return await prisma.orderItem.update({ where: { id }, data })
  }

  async delete(id: string) {
    return await prisma.orderItem.delete({ where: { id } })
  }

  async deleteMany(ids: string[]) {
    const deletedItems = await prisma.orderItem.deleteMany({
      where: { id: { in: ids } },
    })
    return deletedItems.count
  }

  async deleteManyByOrderId(orderId: string): Promise<number> {
    const deletedItems = await prisma.orderItem.deleteMany({
      where: { orderId },
    })
    return deletedItems.count
  }
}

export { OrderItemRepository }
