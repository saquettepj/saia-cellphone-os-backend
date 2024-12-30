import { Prisma, SystemConfig } from '@prisma/client'

import { ISystemConfigRepository } from './ISystemConfigRepository'

import { prisma } from '@/app'

class SystemConfigRepository implements ISystemConfigRepository {
  async create(data: Prisma.SystemConfigCreateInput): Promise<SystemConfig> {
    const createdSystemConfig = await prisma.systemConfig.create({ data })
    return createdSystemConfig
  }

  async update(
    id: string,
    data: Prisma.SystemConfigUpdateInput,
  ): Promise<SystemConfig> {
    const updatedSystemConfig = await prisma.systemConfig.update({
      where: { id },
      data,
    })
    return updatedSystemConfig
  }

  async get(id: string): Promise<SystemConfig | null> {
    const systemConfig = await prisma.systemConfig.findUnique({
      where: { id },
    })
    return systemConfig
  }
}

export { SystemConfigRepository }
