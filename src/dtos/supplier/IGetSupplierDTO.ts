import { z } from 'zod'

export const IGetSupplierDTO = z
  .object({
    name: z.string().optional(),
    CNPJ: z
      .string()
      .length(14)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' })
      .optional(),
    CEP: z
      .string()
      .length(8)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' })
      .optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .strict()
