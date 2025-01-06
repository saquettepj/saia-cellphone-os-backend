import { z } from 'zod'

export const IGetIPNPaymentNotificationDTO = z.object({
  id: z.string(),
})
