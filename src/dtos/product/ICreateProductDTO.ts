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
    warrantyDays: z.number().int().optional(),
    localization: z.string().optional(),
    supplierId: z.string().uuid().optional(),
    NCM: z.string().max(8).optional(),
    cEAN: z.string().max(14).optional(),
  })
  .strict()
