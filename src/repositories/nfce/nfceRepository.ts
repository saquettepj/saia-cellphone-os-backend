import { Prisma } from '@prisma/client'

import { INfceRepository } from './INfceRepository'

import { prisma } from '@/app'

class NfceRepository implements INfceRepository {
  async findByChNFe(chNFe: string) {
    const searchedNfce = await prisma.nfce.findUnique({ where: { chNFe } })
    return searchedNfce
  }

  async findOneByOrderId(orderId: string) {
    const searchedNfce = await prisma.nfce.findFirst({
      where: {
        orderId,
      },
    })

    return searchedNfce
  }

  async updateByChNFe(chNFe: string, data: Prisma.NfceUpdateInput) {
    const updatedNfce = await prisma.nfce.update({
      where: { chNFe },
      data,
    })
    return updatedNfce
  }

  async delete(chNFe: string) {
    const deletedNfce = await prisma.nfce.delete({ where: { chNFe } })
    return deletedNfce
  }

  async create(data: Prisma.NfceUncheckedCreateInput) {
    const createdNfce = await prisma.nfce.create({ data })
    return createdNfce
  }
}

export { NfceRepository }
