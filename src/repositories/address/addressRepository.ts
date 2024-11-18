import { Prisma } from '@prisma/client'

import { IAddressRepository } from '@/repositories/address/IAddressRepository'
import { prisma } from '@/app'

class AddressRepository implements IAddressRepository {
  async findById(id: string) {
    const address = await prisma.address.findUnique({
      where: { id },
    })
    return address
  }

  async findByClientId(clientId: string) {
    const address = await prisma.address.findUnique({
      where: { clientId },
    })
    return address
  }

  async findByCompanyId(companyId: string) {
    const address = await prisma.address.findFirst({
      where: { companyId, clientId: null },
    })
    return address
  }

  async findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.AddressCreateManyInput>,
  ) {
    const address = await prisma.address.findFirst({
      where: {
        companyId,
        ...(data.id && { id: { contains: data.id } }),
        ...(data.city && { city: { contains: data.city } }),
        ...(data.state && { state: { contains: data.state } }),
        ...(data.zipCode && { zipCode: { contains: data.zipCode } }),
      },
    })
    return address
  }

  async updateByClientId(clientId: string, data: Prisma.AddressUpdateInput) {
    const clientAddress = await prisma.address.findFirst({
      where: { clientId },
    })

    const updatedAddress = await prisma.address.update({
      where: { id: clientAddress?.id },
      data,
    })

    return updatedAddress
  }

  async updateByCompanyId(companyId: string, data: Prisma.AddressUpdateInput) {
    const companyAddress = await prisma.address.findFirst({
      where: { companyId, clientId: null },
    })

    const updatedAddress = await prisma.address.update({
      where: { id: companyAddress?.id },
      data,
    })
    return updatedAddress
  }

  async delete(id: string) {
    const deletedAddress = await prisma.address.delete({
      where: { id },
    })
    return deletedAddress
  }

  async create(data: Prisma.AddressUncheckedCreateInput) {
    const createdAddress = await prisma.address.create({
      data,
    })
    return createdAddress
  }
}

export { AddressRepository }
