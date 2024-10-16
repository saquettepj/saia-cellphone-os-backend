import { z } from 'zod'

export const IUpdateEmployeeDTO = z.object({
  name: z.string().optional(),
  CPF: z
    .string()
    .length(11)
    .regex(/^[0-9]+$/),
  phone: z.string().optional(),
  role: z.string().optional(),
})
