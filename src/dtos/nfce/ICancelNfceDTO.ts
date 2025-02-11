import { z } from 'zod'

export const ICancelNfceDTO = z
  .object({
    orderId: z.string().uuid(),
    xJust: z.string().min(15),
  })
  .strict()
