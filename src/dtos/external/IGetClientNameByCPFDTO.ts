import { z } from 'zod'

export const IGetClientNameByCPFDTO = z.object({
  CPF: z
    .string()
    .length(11)
    .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
})
