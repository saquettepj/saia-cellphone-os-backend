import { Prisma } from '@prisma/client'

import { INfeDataRepository } from './INfeDataRepository'

import { prisma } from '@/app'

class NfeDataRepository implements INfeDataRepository {
  async findById(id: string) {
    const searchedNfeData = await prisma.nfeData.findUnique({ where: { id } })
    return searchedNfeData
  }

  async findOneByCompanyId(companyId: string) {
    const searchedNfeData = await prisma.nfeData.findUnique({
      where: {
        companyId,
      },
    })

    return searchedNfeData
  }

  async updateByCompanyId(companyId: string, data: Prisma.NfeDataUpdateInput) {
    const updatedNfeData = await prisma.nfeData.update({
      where: { companyId },
      data,
    })
    return updatedNfeData
  }

  async delete(id: string) {
    const deletedNfeData = await prisma.nfeData.delete({ where: { id } })
    return deletedNfeData
  }

  async create(data: Prisma.NfeDataUncheckedCreateInput) {
    const createdNfeData = await prisma.nfeData.create({ data })
    return createdNfeData
  }
}

export { NfeDataRepository }
