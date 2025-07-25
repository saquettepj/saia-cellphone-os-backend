import { z } from 'zod'

import { ICreateAddressOnClientDTO } from '../address/ICreateAddressOnClientDTO'

export const ICreateClientDTO = z
  .object({
    name: z.string(),
    CPF: z
      .string()
      .length(11)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' }),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: ICreateAddressOnClientDTO.optional(),
  })
  .strict()
