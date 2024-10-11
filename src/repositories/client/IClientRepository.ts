import { Client, Order, Prisma } from '@prisma/client'

interface IClient extends Client {
  orders?: Order[] | null
}

interface IClientRepository {
  findByCPF(CPF: string): Promise<IClient | null>
  findByEmail(email: string): Promise<IClient | null>
  findById(id: string): Promise<IClient | null>
  findAllIncludeById(id: string): Promise<IClient | null>
  updateById(id: string, data: Prisma.ClientUpdateInput): Promise<IClient>
  delete(id: string): Promise<IClient | null>
  create(data: Prisma.ClientUncheckedCreateInput): Promise<IClient>
}

export { IClientRepository, IClient }
