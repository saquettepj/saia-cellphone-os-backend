import { Prisma, Service } from '@prisma/client'

interface IServiceRepository {
  findById(id: string): Promise<Service | null>
  findManyByIds(ids: string[]): Promise<Service[]>
  findByStatus(status: string): Promise<Service[] | null>
  findAllByFilters(
    data: Partial<Prisma.ServiceCreateManyInput>,
  ): Promise<Service[]>
  updateById(
    id: string,
    data: Prisma.ServiceUncheckedUpdateInput,
  ): Promise<Service>
  delete(id: string): Promise<Service | null>
  deleteMany(ids: string[]): Promise<number>
  create(data: Prisma.ServiceUncheckedCreateInput): Promise<Service>
}

export { IServiceRepository }
