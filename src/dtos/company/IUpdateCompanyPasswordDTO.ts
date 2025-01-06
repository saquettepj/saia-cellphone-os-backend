import { z } from 'zod'

export const IUpdateCompanyPasswordDTO = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(12).max(25),
    passwordConfirmation: z.string().min(12).max(25),
  })
  .strict()
