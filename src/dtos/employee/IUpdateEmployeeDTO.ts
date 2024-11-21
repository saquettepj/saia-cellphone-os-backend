import { z } from 'zod'

import { RoleEnum } from '@/enums/all.enum'

export const IUpdateEmployeeDTO = z
  .object({
    name: z.string().optional(),
    CPF: z
      .string()
      .length(11)
      .regex(/^[0-9]+$/)
      .optional(),
    phone: z.string().optional(),
    role: z.nativeEnum(RoleEnum).optional(),
  })
  .strict()
