import { NfeData, Prisma } from '@prisma/client'

interface INfeDataRepository {
  findById(id: string): Promise<NfeData | null>
  findOneByCompanyId(companyId: string): Promise<NfeData | null>
  updateByCompanyId(
    companyId: string,
    data: Prisma.NfeDataUpdateInput,
  ): Promise<NfeData>
  delete(id: string): Promise<NfeData>
  create(data: Partial<Prisma.NfeDataUncheckedCreateInput>): Promise<NfeData>
}

export { INfeDataRepository }
