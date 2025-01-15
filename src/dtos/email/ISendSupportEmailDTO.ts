import { z } from 'zod'

export const ISendSupportEmailDTO = z
  .object({
    text: z.string().max(1500),
  })
  .strict()
