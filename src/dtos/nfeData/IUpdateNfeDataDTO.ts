import { z } from 'zod'

import { NfeDataRegimeTributarioEnum } from '@/enums/all.enum'

export const IUpdateNfeDataDTO = z.object({
  inscricaoEstadual: z.string().optional(),
  regimeTributario: z.nativeEnum(NfeDataRegimeTributarioEnum).optional(),
  codigoRegimeTributario: z.string().optional(),
  cnae: z.string().optional(),
  idCSC: z.string().optional(),
  CSC: z.string().optional(),
})
