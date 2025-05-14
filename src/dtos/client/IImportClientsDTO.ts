import { z } from 'zod'

export const IImportClientsDTO = z.object({
  clients: z.array(
    z.object({
      name: z.string(),
      CPF: z
        .string()
        .length(11)
        .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    }),
  ),
})
