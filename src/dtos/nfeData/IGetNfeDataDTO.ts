import { z } from 'zod'

import { NfeDataRegimeTributarioEnum } from '@/enums/all.enum'

export const IGetNfeDataDTO = z.object({
  id: z.string().max(36).optional(),
  inscricaoEstadual: z.string().optional(),
  regimeTributario: z.nativeEnum(NfeDataRegimeTributarioEnum).optional(),
  codigoRegimeTributario: z.string().optional(),
  cnae: z.string().optional(),
  idCSC: z.string().optional(),
  CSC: z.string().optional(),
})
