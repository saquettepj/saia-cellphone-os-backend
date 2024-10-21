import { Prisma } from '@prisma/client'

import { INfeDataRepository } from './INfeDataRepository'

import { prisma } from '@/app'

class NfeDataRepository implements INfeDataRepository {
  async findById(id: string) {
    const searchedNfeData = await prisma.nfeData.findUnique({ where: { id } })
    return searchedNfeData
  }

  async findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.NfeDataCreateManyInput>,
  ) {
    const searchedNfeData = await prisma.nfeData.findMany({
      where: {
        companyId,
        ...(data.id && { id: { contains: data.id } }),
        ...(data.inscricaoEstadual && {
          inscricaoEstadual: { contains: data.inscricaoEstadual },
        }),
        ...(data.regimeTributario && {
          regimeTributario: { contains: data.regimeTributario },
        }),
        ...(data.codigoRegimeTributario && {
          codigoRegimeTributario: { contains: data.codigoRegimeTributario },
        }),
        ...(data.cnae && { cnae: { contains: data.cnae } }),
        ...(data.idCSC && { idCSC: { contains: data.idCSC } }),
        ...(data.CSC && { CSC: { contains: data.CSC } }),
      },
    })

    return searchedNfeData
  }

  async updateById(id: string, data: Prisma.NfeDataUpdateInput) {
    const updatedNfeData = await prisma.nfeData.update({ where: { id }, data })
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
