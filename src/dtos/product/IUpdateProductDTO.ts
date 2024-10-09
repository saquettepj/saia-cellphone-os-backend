import { z } from 'zod'

import { ProductConditionEnum } from '../../enums/all.enum'

export const IUpdateProductDTO = z.object({
  manufactureBy: z.string().max(200).optional(),
  model: z.string().max(200).optional(),
  condition: z.nativeEnum(ProductConditionEnum).optional(),
  description: z.string().max(600).optional(),
})
