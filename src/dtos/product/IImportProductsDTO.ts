import { z } from 'zod'

import { formatUniqueStrings } from '@/utils/formatUniqueStrings'
import { ProductConditionEnum, ProductTypeEnum } from '@/enums/all.enum'

export const IImportProductsDTO = z.object({
  products: z.array(
    z.object({
      type: z.literal(ProductTypeEnum.PRODUCT),
      condition: z.literal(ProductConditionEnum.NEW),
      description: z
        .string()
        .max(200)
        .transform((value) => formatUniqueStrings(value)),
      price: z.number(),
      cost: z.number(),
      quantity: z.number().min(1),
      localization: z.string().optional(),
      cEAN: z.string().max(14).optional(),
    }),
  ),
})
