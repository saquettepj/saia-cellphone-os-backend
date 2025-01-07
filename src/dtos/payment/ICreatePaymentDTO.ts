import { z } from 'zod'

export const ICreatePaymentDTO = z.object({
  transaction_amount: z.number().max(20),
  payment_method_id: z.string(),
  installments: z.number().optional(),
  token: z.string().optional(),
  issuer_id: z.string().optional(),
  payer: z.object({
    email: z.string().email(),
    identification: z
      .object({
        type: z.string(),
        number: z.string(),
      })
      .optional(),
  }),
})
