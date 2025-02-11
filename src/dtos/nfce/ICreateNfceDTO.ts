import { z } from 'zod'

export const ICreateNfceDTO = z
  .object({
    orderId: z.string().uuid(),
    cEANDisabled: z.boolean().optional().default(false),
  })
  .strict()
