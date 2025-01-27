import { z } from 'zod'

export const ICreateOrUpdateNfeDataDTO = z
  .object({
    certificatePassword: z.string().nonempty(),
    idCSC: z.string().nonempty(),
    CSC: z.string().nonempty(),
  })
  .strict()
