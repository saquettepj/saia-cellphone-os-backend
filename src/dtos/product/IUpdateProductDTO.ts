import { z } from 'zod'

import { ProductConditionEnum, ProductTypeEnum } from '../../enums/all.enum'

import { formatUniqueStrings } from '@/utils/formatUniqueStrings'

export const IUpdateProductDTO = z
  .object({
    type: z.nativeEnum(ProductTypeEnum).optional(),
    price: z.number().optional(),
    cost: z.number().optional(),
    condition: z.nativeEnum(ProductConditionEnum).optional(),
    description: z
      .string()
      .max(200)
      .transform((value) => formatUniqueStrings(value))
      .optional(),
    quantity: z.number().optional(),
    warrantyDays: z.number().int().optional(),
    localization: z.string().optional(),
    supplierId: z.string().uuid().optional(),
    NCM: z.string().max(8).optional(),
    cEAN: z.string().max(14).optional(),
  })
  .strict()
