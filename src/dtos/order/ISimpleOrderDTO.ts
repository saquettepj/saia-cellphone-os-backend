import { z } from 'zod'

export const ISimpleOrderDTO = z.object({
  id: z.string().uuid(),
})
