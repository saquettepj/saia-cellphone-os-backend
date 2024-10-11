import { Prisma } from '@prisma/client'

import { IClientRepository } from './IClientRepository'

import { prisma } from '@/app'

class ClientRepository implements IClientRepository {
  async findByCPF(CPF: string) {
    const searchedClient = await prisma.client.findUnique({ where: { CPF } })
    return searchedClient
  }

  async findByEmail(email: string) {
    const searchedClient = await prisma.client.findUnique({
      where: { email },
    })
    return searchedClient
  }

  async findById(id: string) {
    const searchedClient = await prisma.client.findUnique({ where: { id } })
    return searchedClient
  }

  async findAllIncludeById(id: string) {
    const searchedClient = await prisma.client.findUnique({
      where: { id },
      include: { orders: { where: { clientId: id } } },
    })
    return searchedClient
  }

  async updateById(id: string, data: Prisma.ClientUpdateInput) {
    const updatedClient = await prisma.client.update({
      where: { id },
      data,
    })
    return updatedClient
  }

  async delete(id: string) {
    const deletedClient = await prisma.client.delete({ where: { id } })
    return deletedClient
  }

  async create(data: Prisma.ClientUncheckedCreateInput) {
    const createdClient = await prisma.client.create({
      data,
    })
    return createdClient
  }
}

export { ClientRepository }
