import { z } from 'zod'

export const IDeleteCompanyDTO = z
  .object({
    password: z.string(),
  })
  .strict()
