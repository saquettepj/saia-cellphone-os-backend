import { z } from 'zod'

export const IUpdateForgotCompanyPasswordDTO = z
  .object({
    CNPJ: z
      .string()
      .length(14)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
    email: z.string().email(),
  })
  .strict()
