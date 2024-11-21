import { z } from 'zod'

export const IGetOrderItemDTO = z
  .object({
    id: z.string().uuid().optional(),
    orderId: z.string().uuid().optional(),
    discount: z.number().optional(),
    productId: z.string().uuid().optional(),
    quantity: z.number().min(1).optional(),
  })
  .strict()
