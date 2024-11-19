import { z } from 'zod'

export const ISimpleServiceDTO = z
  .object({
    id: z.string().uuid(),
  })
  .strict()
