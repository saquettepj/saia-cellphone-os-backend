import { z } from 'zod'

export const ICheckerNfeDataDTO = z.object({
  nfeDataId: z.string().uuid(),
})
