import { z } from 'zod'

export const ISimpleSupplierDTO = z
  .object({
    id: z.string().uuid(),
  })
  .strict()
