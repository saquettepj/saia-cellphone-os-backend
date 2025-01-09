import { z } from 'zod'

export const ICreateCompanyDTO = z
  .object({
    CNPJ: z
      .string()
      .length(14)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
    email: z.string().email(),
    name: z.string(),
    country: z.string(),
    city: z.string(),
    state: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    zipCode: z
      .string()
      .length(8)
      .regex(/^[0-9]+$/),
    password: z.string().min(12).max(25),
    passwordConfirmation: z.string().min(12).max(25),
  })
  .strict()
