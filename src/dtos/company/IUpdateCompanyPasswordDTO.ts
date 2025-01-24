import { z } from 'zod'

export const IUpdateCompanyPasswordDTO = z
  .object({
    CNPJ: z
      .string()
      .length(14)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
    currentPassword: z.string(),
    newPassword: z.string().min(12).max(25),
    passwordConfirmation: z.string().min(12).max(25),
  })
  .strict()
