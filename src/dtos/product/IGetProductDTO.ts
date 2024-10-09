import { z } from 'zod'

export const IGetProductDTO = z.object({
  id: z.string().max(36).optional(),
  manufactureBy: z.string().max(200).optional(),
  model: z.string().max(200).optional(),
  condition: z.string().max(30).optional(),
  description: z.string().max(600).optional(),
})
