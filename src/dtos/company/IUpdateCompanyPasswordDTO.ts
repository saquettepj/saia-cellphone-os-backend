import { z } from 'zod'

export const IUpdateCompanyPasswordDTO = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8)
      .max(25)
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#%])/, {
        message:
          'Password must have at least one uppercase letter, one lowercase letter, one number and one special character:',
      }),
    passwordConfirmation: z
      .string()
      .min(8)
      .max(25)
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#%])/, {
        message:
          'Password must have at least one uppercase letter, one lowercase letter, one number and one special character:',
      }),
  })
  .strict()
