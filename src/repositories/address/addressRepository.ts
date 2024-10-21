import { Address, Prisma } from '@prisma/client'

import { IAddressRepository } from '@/repositories/address/IAddressRepository'
import { prisma } from '@/app'

class AddressRepository implements IAddressRepository {
  async findById(id: string): Promise<Address | null> {
    const address = await prisma.address.findUnique({
      where: { id },
    })
    return address
  }

  async findByClientId(clientId: string): Promise<Address | null> {
    const address = await prisma.address.findUnique({
      where: { clientId },
    })
    return address
  }

  async findByCompanyId(companyId: string): Promise<Address | null> {
    const address = await prisma.address.findUnique({
      where: { companyId },
    })
    return address
  }

  async findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.AddressCreateManyInput>,
  ): Promise<Address[]> {
    const addresses = await prisma.address.findMany({
      where: {
        companyId,
        ...(data.id && { id: { contains: data.id } }),
        ...(data.city && { city: { contains: data.city } }),
        ...(data.state && { state: { contains: data.state } }),
        ...(data.zipCode && { zipCode: { contains: data.zipCode } }),
      },
    })
    return addresses
  }

  async updateByClientId(
    clientId: string,
    data: Prisma.AddressUpdateInput,
  ): Promise<Address> {
    const updatedAddress = await prisma.address.update({
      where: { clientId },
      data,
    })
    return updatedAddress
  }

  async updateByCompanyId(
    companyId: string,
    data: Prisma.AddressUpdateInput,
  ): Promise<Address> {
    const updatedAddress = await prisma.address.update({
      where: { companyId },
      data,
    })
    return updatedAddress
  }

  async delete(id: string): Promise<Address | null> {
    const deletedAddress = await prisma.address.delete({
      where: { id },
    })
    return deletedAddress
  }

  async deleteMany(ids: string[]): Promise<number> {
    const deletedAddresses = await prisma.address.deleteMany({
      where: { id: { in: ids } },
    })
    return deletedAddresses.count
  }

  async create(data: Prisma.AddressUncheckedCreateInput): Promise<Address> {
    const createdAddress = await prisma.address.create({
      data,
    })
    return createdAddress
  }
}

export { AddressRepository }
