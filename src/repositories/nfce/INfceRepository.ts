import { Nfce, Prisma } from '@prisma/client'

interface INfceRepository {
  findByChNFe(chNFe: string): Promise<Nfce | null>
  findOneByOrderId(orderId: string): Promise<Nfce | null>
  updateByChNFe(chNFe: string, data: Prisma.NfceUpdateInput): Promise<Nfce>
  delete(chNFe: string): Promise<Nfce>
  create(data: Partial<Prisma.NfceUncheckedCreateInput>): Promise<Nfce>
}

export { INfceRepository }
