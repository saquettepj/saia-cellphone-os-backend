import { NfeData, Prisma } from '@prisma/client'

interface INfeDataRepository {
  findById(id: string): Promise<NfeData | null>
  create(data: Prisma.NfeDataUncheckedCreateInput): Promise<NfeData>
  delete(id: string): Promise<NfeData | null>
  updateById(id: string, data: Prisma.NfeDataUpdateInput): Promise<NfeData>
}

export { INfeDataRepository }
