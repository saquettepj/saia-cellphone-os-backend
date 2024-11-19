import { z } from 'zod'

import { ProductConditionEnum, ProductTypeEnum } from '../../enums/all.enum'

import { formatUniqueStrings } from '@/utils/formatUniqueStrings'

export const ICreateProductDTO = z
  .object({
    type: z.nativeEnum(ProductTypeEnum),
    condition: z.nativeEnum(ProductConditionEnum),
    description: z
      .string()
      .max(200)
      .transform((value) => formatUniqueStrings(value)),
    price: z.number(),
    cost: z.number(),
    quantity: z.number().min(1),
    localization: z.string().optional(),
    supplierId: z.string().optional(),
  })
  .strict()
