import { Address, Client, Prisma } from '@prisma/client'

interface IClient extends Client {
  address?: Address | null
}

export interface FindManyByCPFInput {
  companyId: string
  CPFs: string[]
}

export interface FindManyByEmailInput {
  companyId: string
  emails: string[]
}

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
  ): Promise<IClient[]>
  create(
    data: Prisma.ClientUncheckedCreateInput & {
      address?: Prisma.AddressUncheckedCreateInput | null
    },
  ): Promise<IClient>
  findManyByCPF(data: FindManyByCPFInput): Promise<Client[]>
  findManyByEmail(data: FindManyByEmailInput): Promise<Client[]>
  createMany(data: Prisma.ClientUncheckedCreateInput[]): Promise<Client[]>
  updateById(id: string, data: Prisma.ClientUpdateInput): Promise<Client>
  delete(id: string): Promise<Client | null>
  deleteMany(ids: string[]): Promise<number>
}

export { IClientRepository }
