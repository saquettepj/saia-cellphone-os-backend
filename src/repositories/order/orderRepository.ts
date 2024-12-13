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
    data: Partial<Prisma.OrderCreateManyInput>,
  ): Promise<IOrder[]> {
    const searchedOrders = await prisma.order.findMany({
      where: {
        companyId,
        ...(data.IMEI && { IMEI: { contains: data.IMEI } }),
        ...(data.clientId && { clientId: { contains: data.clientId } }),
        ...(data.employeeId && { employeeId: { contains: data.employeeId } }),
        ...(data.number && { number: data.number }),
        ...(data.type && { type: { contains: data.type } }),
        ...(data.status && { status: { contains: data.status } }),
        ...(data.payDate && { payDate: data.payDate }),
        ...(data.paymentMethod && {
          paymentMethod: { contains: data.paymentMethod },
        }),
        ...(data.paymentStatus && {
          paymentStatus: { contains: data.paymentStatus },
        }),
        ...(data.dueDate && { dueDate: data.dueDate }),
        ...(data.numberOfInstallments && {
          numberOfInstallments: data.numberOfInstallments,
        }),
        ...(data.interest && { interest: data.interest }),
        ...(data.price && { price: data.price }),
        ...(data.description && {
          description: { contains: data.description },
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
    return await prisma.$transaction(async (prisma) => {
      const createdOrder = await prisma.order.create({
        data: {
          ...data,
          orderItems: {
            create: data.orderItems?.map((item) => {
              const serviceData = item.service
                ? {
                    create: item.service,
                  }
                : undefined

              return {
                productId: item.productId,
                registeredProductPrice: item.registeredProductPrice,
                quantity: item.quantity,
                initialQuantity: item.initialQuantity,
                discount: item.discount,
                service: serviceData,
              }
            }),
          },
        },
        include: {
          orderItems: {
            include: {
              service: true,
            },
          },
        },
      })

      return {
        ...createdOrder,
        orderItems: createdOrder.orderItems.map((item) => ({
          ...item,
          service: item.service || undefined,
        })),
      }
    })
  }
}

export { OrderRepository }
