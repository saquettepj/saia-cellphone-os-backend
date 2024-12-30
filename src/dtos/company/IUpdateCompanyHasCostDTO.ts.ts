import { z } from 'zod'

export const IUpdateCompanyHasCostDTO = z
  .object({
    hasCost: z.boolean(),
  })
  .strict()
