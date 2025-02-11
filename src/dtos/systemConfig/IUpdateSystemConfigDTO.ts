import { z } from 'zod'

export const IUpdateSystemConfigDTO = z
  .object({
    terms: z.string().optional(),
    subscriptionAgreement: z.string().optional(),
    password: z.string(),
  })
  .strict()
