import { z } from 'zod'

export const IUpdateCompanyDTO = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
})
