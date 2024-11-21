import { z } from 'zod'

export const IUpdateOrderItemDTO = z
  .object({
    quantity: z.number().min(1).optional(),
    discount: z.number().optional(),
  })
  .strict()
