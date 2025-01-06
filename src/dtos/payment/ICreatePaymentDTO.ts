import { z } from 'zod'

export const ICreatePaymentDTO = z.object({
  transaction_amount: z.number().max(5),
  payment_method_id: z.string(),
  payer: z.object({
    email: z.string().email(),
  }),
})
