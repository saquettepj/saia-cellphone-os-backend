import { z } from 'zod'

export const ICreateAddressOnClientDTO = z
  .object({
    country: z.string(),
    city: z.string(),
    state: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    zipCode: z
      .string()
      .length(8)
      .regex(/^[0-9]+$/),
  })
  .strict()
