import { Prisma } from '@prisma/client'

import { IClientRepository } from './IClientRepository'

import { prisma } from '@/app'

class ClientRepository implements IClientRepository {
  async findById(id: string) {
    const client = await prisma.client.findUnique({ where: { id } })
    return client
  }

  async create(
    data: Prisma.ClientUncheckedCreateInput & {
      address?: Prisma.AddressUncheckedCreateInput | null
    },
  ) {
    const createdClient = await prisma.client.create({
      data: {
        ...data,
        address: data.address
          ? {
              create: data.address,
            }
          : undefined,
      },
      include: {
        address: true,
      },
    })

    return createdClient
  }

  async updateById(id: string, data: Prisma.ClientUpdateInput) {
    const updatedClient = await prisma.client.update({ where: { id }, data })
    return updatedClient
  }

  async delete(id: string) {
    const deletedClient = await prisma.client.delete({ where: { id } })
    return deletedClient
  }

  async deleteMany(ids: string[]) {
    const deletedClients = await prisma.client.deleteMany({
      where: { id: { in: ids } },
    })
    return deletedClients.count
  }

  async findByCPF(CPF: string) {
    const client = prisma.client.findFirst({ where: { CPF } })
    return client
  }

  async findByCPFAndCompanyId(CPF: string, companyId: string) {
    const client = await prisma.client.findFirst({
      where: {
        companyId,
        CPF,
      },
    })
    return client
  }

  async findByEmail(email: string) {
    const client = prisma.client.findFirst({ where: { email } })
    return client
  }

  async findByEmailAndCompanyId(email: string, companyId: string) {
    const client = await prisma.client.findFirst({
      where: {
        email,
        companyId,
      },
    })
    return client
  }

  async findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.ClientCreateManyInput>,
  ) {
    const searchedClients = await prisma.client.findMany({
      where: {
        companyId,
        ...(data.id && { id: { contains: data.id } }),
        ...(data.CPF && { CPF: { contains: data.CPF } }),
        ...(data.email && { email: { contains: data.email } }),
        ...(data.name && { name: { contains: data.name } }),
      },
      include: {
        address: true,
        orders: true,
        Nfes: true,
      },
    })

    return searchedClients
  }

  async findAllIncludeById(id: string) {
    const searchedCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        address: { where: { clientId: id } },
        orders: { where: { clientId: id } },
        Nfes: { where: { clientId: id } },
      },
    })

    return searchedCompany
  }
}

export { ClientRepository }
