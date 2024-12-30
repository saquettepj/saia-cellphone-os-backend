import { Prisma, SystemConfig } from '@prisma/client'

interface ISystemConfigRepository {
  create(data: Prisma.SystemConfigCreateInput): Promise<SystemConfig>
  update(
    id: string,
    data: Prisma.SystemConfigUpdateInput,
  ): Promise<SystemConfig>
  get(id: string): Promise<SystemConfig | null>
}

export { ISystemConfigRepository }
