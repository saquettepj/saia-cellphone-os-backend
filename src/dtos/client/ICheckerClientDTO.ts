import { z } from 'zod'

export const ICheckerClientDTO = z.object({
  clientId: z.string().uuid(),
})
