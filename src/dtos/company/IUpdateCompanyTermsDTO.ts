import { z } from 'zod'

import { ValidateMessagesEnum } from '@/enums/all.enum'
import { validateDateOnRequests } from '@/utils/validateDateOnRequests'

export const IUpdateCompanyTermsDTO = z
  .object({
    termsDate: z.string().refine((val) => validateDateOnRequests(val), {
      message: ValidateMessagesEnum.DATE_ON_ISO,
    }),
  })
  .strict()
