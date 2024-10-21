import { NfeData, Prisma } from '@prisma/client'

interface INfeDataRepository {
  findById(id: string): Promise<NfeData | null>
  findAllByCompanyId(
    companyId: string,
    data: Partial<Prisma.NfeDataCreateManyInput>,
  ): Promise<NfeData[]>
  updateById(id: string, data: Prisma.NfeDataUpdateInput): Promise<NfeData>
  delete(id: string): Promise<NfeData | null>
  create(data: Partial<Prisma.NfeDataUncheckedCreateInput>): Promise<NfeData>
}

export { INfeDataRepository }
