import { z } from 'zod'

export const ICreateCompanyDTO = z.object({
  CNPJ: z
    .string()
    .length(14)
    .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
  email: z.string().email(),
  name: z.string(),
  password: z
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
