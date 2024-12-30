import { z } from 'zod'

export const IUpdateSystemConfigDTO = z
  .object({
    terms: z.string().optional(),
    password: z.string(),
  })
  .strict()
