import { z } from 'zod'

export const ICreateOrderItemDTO = z
  .object({
    productId: z.string().uuid(),
    quantity: z.number().min(1),
  })
  .strict()
