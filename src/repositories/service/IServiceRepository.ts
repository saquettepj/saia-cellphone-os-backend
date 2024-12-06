import { Employee, Prisma, Service } from '@prisma/client'

interface IService extends Service {
  employee?: Employee | null
}

interface IServiceRepository {
  findById(id: string): Promise<IService | null>
  findManyByIds(ids: string[]): Promise<IService[]>
  findByStatus(status: string): Promise<IService[] | null>
  findAllByFilters(data: Partial<IService>): Promise<IService[]>
  updateById(
    id: string,
    data: Prisma.ServiceUncheckedUpdateInput,
  ): Promise<IService>
  delete(id: string): Promise<IService | null>
  deleteMany(ids: string[]): Promise<number>
  create(data: Prisma.ServiceUncheckedCreateInput): Promise<IService>
}

export { IServiceRepository }
