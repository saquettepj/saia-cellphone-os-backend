import { z } from 'zod'

import { formatUniqueStrings } from '@/utils/formatUniqueStrings'

export const IGetProductDTO = z
  .object({
    id: z.string().max(36).optional(),
    type: z.string().optional(),
    condition: z.string().max(30).optional(),
    description: z
      .string()
      .max(200)
      .transform((value) => formatUniqueStrings(value))
      .optional(),
    price: z.number().optional(),
    cost: z.number().optional(),
    quantity: z.number().optional(),
    warrantyDays: z.number().int().optional(),
    localization: z.string().optional(),
    supplierId: z.string().optional(),
  })
  .strict()
