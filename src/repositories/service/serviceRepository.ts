import { Prisma } from '@prisma/client'

import { IServiceRepository } from './IServiceRepository'

import { prisma } from '@/app'

class ServiceRepository implements IServiceRepository {
  async findById(id: string) {
    const searchedService = await prisma.service.findUnique({ where: { id } })
    return searchedService
  }

  async findManyByIds(ids: string[]) {
    return prisma.service.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }

  async findByStatus(status: string) {
    const searchedServices = await prisma.service.findMany({
      where: { status },
    })
    return searchedServices
  }

  async findAllByFilters(data: Partial<Prisma.ServiceCreateManyInput>) {
    const searchedServices = await prisma.service.findMany({
      where: {
        ...(data.id && { id: { contains: data.id } }),
        ...(data.orderItemId && {
          orderItemId: { contains: data.orderItemId },
        }),
        ...(data.employeeId && { employeeId: { contains: data.employeeId } }),
        ...(data.status && { status: { contains: data.status } }),
        ...(data.report && { report: { contains: data.report } }),
      },
    })

    return searchedServices
  }

  async updateById(id: string, data: Prisma.ServiceUpdateInput) {
    const updatedService = await prisma.service.update({ where: { id }, data })

    return updatedService
  }

  async delete(id: string) {
    const deletedService = await prisma.service.delete({ where: { id } })

    return deletedService
  }

  async deleteMany(ids: string[]) {
    const deletedServices = await prisma.service.deleteMany({
      where: { id: { in: ids } },
    })

    return deletedServices.count
  }

  async create(data: Prisma.ServiceUncheckedCreateInput) {
    const createdService = await prisma.service.create({ data })

    return createdService
  }
}

export { ServiceRepository }
