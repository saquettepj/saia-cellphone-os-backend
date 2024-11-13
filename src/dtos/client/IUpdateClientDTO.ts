import { z } from 'zod'

export const IUpdateClientDTO = z
  .object({
    name: z.string().optional(),
    CPF: z
      .string()
      .length(11)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' })
      .optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .strict()
