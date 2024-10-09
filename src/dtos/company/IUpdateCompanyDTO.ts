import { z } from 'zod'

export const IUpdateCompanyDTO = z.object({
  CNPJ: z
    .string()
    .length(14)
    .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
  password: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  CEP: z.string().optional(),
})
