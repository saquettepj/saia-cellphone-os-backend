import { z } from 'zod'

export const ICreateOrUpdateNfeDataDTO = z
  .object({
    certificatePassword: z.string().nonempty(),
    idCSC: z
      .string()
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' })
      .nonempty(),
    CSC: z.string().nonempty(),
    IE: z
      .string()
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' })
      .nonempty(),
    IM: z
      .string()
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' })
      .nonempty(),
    lastNNF: z
      .string()
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' })
      .nonempty(),
  })
  .strict()
