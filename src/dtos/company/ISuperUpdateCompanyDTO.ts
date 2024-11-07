import { z } from 'zod'

import { ValidateMessagesEnum } from '@/enums/all.enum'
import { validateDateOnRequests } from '@/utils/validateDateOnRequests'

export const ISuperUpdateCompanyDTO = z
  .object({
    CNPJ: z
      .string()
      .length(14)
      .regex(/^[0-9]+$/, { message: 'Must be only numbers on string!' })
      .optional(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    emailChecked: z.boolean().optional(),
    payDate: z
      .string()
      .refine((val) => validateDateOnRequests(val), {
        message: ValidateMessagesEnum.DATE_ON_ISO,
      })
      .optional(),
    termsDate: z
      .string()
      .refine((val) => validateDateOnRequests(val), {
        message: ValidateMessagesEnum.DATE_ON_ISO,
      })
      .optional(),
  })
  .strict()
