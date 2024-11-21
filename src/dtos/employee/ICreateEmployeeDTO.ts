import { z } from 'zod'

import { RoleEnum } from '@/enums/all.enum'

export const ICreateEmployeeDTO = z
  .object({
    name: z.string(),
    CPF: z
      .string()
      .length(11)
      .regex(/^[0-9]+$/),
    phone: z.string().optional(),
    role: z.nativeEnum(RoleEnum),
  })
  .strict()
