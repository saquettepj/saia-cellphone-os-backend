import { z } from 'zod'

export const IGetAddressDTO = z
  .object({
    clientId: z.string().uuid().optional(),
  })
  .strict()
