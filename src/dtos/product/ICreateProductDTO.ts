import { z } from 'zod'

import { ProductConditionEnum } from '../../enums/all.enum'

export const ICreateProductDTO = z.object({
  manufactureBy: z.string().max(200),
  model: z.string().max(200),
  condition: z.nativeEnum(ProductConditionEnum),
  description: z.string().max(600).optional(),
})
