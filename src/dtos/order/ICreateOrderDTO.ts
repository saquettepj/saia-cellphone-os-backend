import { z } from 'zod'

import { ICreateOrderItemDTO } from '../orderItems/ICreateOrderItemDTO'

import { validateDateOnRequests } from '@/utils/validateDateOnRequests'
import { ValidateMessagesEnum } from '@/enums/all.enum'

export const ICreateOrderDTO = z
  .object({
    clientId: z.string().uuid(),
    employeeId: z.string().uuid(),
    number: z.number(),
    type: z.string(),
    status: z.string(),
    payDate: z.string().refine((val) => validateDateOnRequests(val), {
      message: ValidateMessagesEnum.DATE_ON_ISO,
    }),
    paymentMethod: z.string(),
    price: z.number(),
    description: z.string().default(''),
    orderItems: z.array(ICreateOrderItemDTO).nonempty(),
  })
  .strict()
