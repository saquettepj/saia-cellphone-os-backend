import { Prisma } from '@prisma/client'

import { INfeDataRepository } from './INfeDataRepository'

import { prisma } from '@/app'

class NfeDataRepository implements INfeDataRepository {
  async findById(id: string) {
    const searchedData = await prisma.nfeData.findUnique({ where: { id } })
    return searchedData
  }

  async create(data: Prisma.NfeDataUncheckedCreateInput) {
    const createdData = await prisma.nfeData.create({
      data,
    })
    return createdData
  }

  async delete(id: string) {
    const deletedData = await prisma.nfeData.delete({ where: { id } })
    return deletedData
  }

  async updateById(id: string, data: Prisma.NfeDataUpdateInput) {
    const updatedData = await prisma.nfeData.update({
      where: { id },
      data,
    })
    return updatedData
  }
}

export { NfeDataRepository }
