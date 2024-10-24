import { z } from 'zod'

export const IUpdateAddressDTO = z
  .object({
    city: z.string().optional(),
    state: z.string().optional(),
    neighborhood: z.string().optional(),
    street: z.string().optional(),
    streetNumber: z.string().optional(),
    zipCode: z.string().optional(),
    clientId: z.string().uuid().optional(),
  })
  .strict()
