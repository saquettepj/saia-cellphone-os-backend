import { IAccessTokenRepository } from './IAccessTokenRepository'

import { prisma } from '@/app'

class AccessTokenRepository implements IAccessTokenRepository {
  async create(data: { companyId?: string; activatedAt?: Date }) {
    const createdAccessToken = await prisma.accessToken.create({
      data: {
        companyId: data?.companyId,
        activatedAt: data?.activatedAt,
      },
    })
    return createdAccessToken
  }

  async findAll() {
    const accessTokens = await prisma.accessToken.findMany()
    return accessTokens
  }

  async findById(id: string) {
    return await prisma.accessToken.findUnique({ where: { code: id } })
  }

  async findByCompanyId(companyId: string) {
    return await prisma.accessToken.findFirst({
      where: { companyId },
    })
  }

  async update(id: string, data: { companyId?: string; updatedAt?: Date }) {
    return await prisma.accessToken.update({
      where: { code: id },
      data: {
        companyId: data?.companyId,
        activatedAt: data?.updatedAt,
      },
    })
  }

  async delete(id: string) {
    return await prisma.accessToken.delete({ where: { code: id } })
  }
}

export { AccessTokenRepository }
