import { z } from 'zod'

export const ICheckerProductDTO = z.object({
  productId: z.string().uuid(),
})
