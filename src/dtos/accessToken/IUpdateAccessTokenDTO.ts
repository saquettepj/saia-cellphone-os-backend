import { z } from 'zod'

export const IUpdateAccessTokenDTO = z.object({
  companyId: z.string().uuid(),
})
