import { z } from 'zod'

import { NfeDataRegimeTributarioEnum } from '@/enums/all.enum'

export const ICreateNfeDataDTO = z
  .object({
    inscricaoEstadual: z.string(),
    regimeTributario: z.nativeEnum(NfeDataRegimeTributarioEnum),
    cnae: z.string(),
    idCSC: z.string(),
    CSC: z.string(),
  })
  .strict()
