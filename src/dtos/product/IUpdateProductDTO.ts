import { z } from 'zod'

import { ProductConditionEnum, ProductTypeEnum } from '../../enums/all.enum'

export const IUpdateProductDTO = z.object({
  type: z.nativeEnum(ProductTypeEnum).optional(),
  price: z.number().optional(),
  condition: z.nativeEnum(ProductConditionEnum).optional(),
  description: z.string().max(600).optional(),
  quantity: z.number().optional(),
})
