import { z } from 'zod'

export const ISimpleNfeDataDTO = z.object({
  id: z.string().uuid(),
})
