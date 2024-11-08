import { z } from 'zod'

export const ICreateAccessTokenDTO = z.object({
  companyId: z.string().uuid().optional(),
})
