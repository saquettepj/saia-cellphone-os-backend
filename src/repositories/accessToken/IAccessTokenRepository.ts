import { AccessToken } from '@prisma/client'

interface IAccessTokenRepository {
  create(data: { companyId?: string; activatedAt?: Date }): Promise<AccessToken>
  findAll(): Promise<AccessToken[]>
  findById(id: string): Promise<AccessToken | null>
  findByCompanyId(companyId: string): Promise<AccessToken | null>
  update(
    id: string,
    data: { companyId?: string; updatedAt?: Date },
  ): Promise<AccessToken>
  delete(id: string): Promise<AccessToken>
}

export { IAccessTokenRepository }
