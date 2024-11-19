import { z } from 'zod'

export const ICreateSupplierDTO = z
  .object({
    name: z.string(),
    CNPJ: z
      .string()
      .length(14)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
    CEP: z
      .string()
      .length(8)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .strict()
