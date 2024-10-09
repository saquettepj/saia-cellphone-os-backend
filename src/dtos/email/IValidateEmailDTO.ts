import { z } from 'zod'

export const IValidateEmailDTO = z.object({
  email: z.string().email(),
})
