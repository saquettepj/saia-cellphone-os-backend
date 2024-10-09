import { z } from 'zod'

export const ISimpleCompanyDTO = z.object({
  id: z.string().uuid(),
})
