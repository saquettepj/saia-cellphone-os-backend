import { z } from 'zod'

export const ICheckerOrderDTO = z.object({
  orderId: z.string().uuid(),
})
