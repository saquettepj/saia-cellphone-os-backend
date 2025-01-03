import { z } from 'zod'

export const IEmailConfirmationCodeDTO = z
  .object({
    emailConfirmationCode: z.number().min(1).max(99999999),
  })
  .strict()
