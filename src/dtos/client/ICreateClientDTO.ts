import { z } from 'zod'

export const ICreateClientDTO = z.object({
  name: z.string(),
  CPF: z
    .string()
    .length(11)
    .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
})
