import { z } from 'zod'

export const IUpdateCompanyHasCostDTO = z
  .object({
    hasCost: z.boolean().default(false),
  })
  .strict()
