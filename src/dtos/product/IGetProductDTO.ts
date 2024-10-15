import { z } from 'zod'

export const IGetProductDTO = z.object({
  id: z.string().max(36).optional(),
  type: z.string().optional(),
  condition: z.string().max(30).optional(),
  description: z.string().max(600).optional(),
})
