import { Client, Prisma } from '@prisma/client'

interface IClientRepository {
  findById(id: string): Promise<Client | null>
  findByCPF(CPF: string): Promise<Client | null>
  findByCPFAndCompanyId(CPF: string, companyId: string): Promise<Client | null>
  findByEmail(email: string): Promise<Client | null>
  findByEmailAndCompanyId(
    email: string,
    companyId: string,
  ): Promise<Client | null>
  findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.ClientCreateManyInput>,
  ): Promise<Client[]>
  create(data: Prisma.ClientUncheckedCreateInput): Promise<Client>
  updateById(id: string, data: Prisma.ClientUpdateInput): Promise<Client>
  delete(id: string): Promise<Client | null>
  deleteMany(ids: string[]): Promise<number>
}

export { IClientRepository }
