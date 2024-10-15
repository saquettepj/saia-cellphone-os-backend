import { z } from 'zod'

import { ProductConditionEnum, ProductTypeEnum } from '../../enums/all.enum'

export const ICreateProductDTO = z.object({
  type: z.nativeEnum(ProductTypeEnum),
  condition: z.nativeEnum(ProductConditionEnum),
  description: z.string().max(200),
  price: z.number(),
  quantity: z.number().min(1),
})
