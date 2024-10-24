import { z } from 'zod'

import { ICheckerProductDTO } from '../product/ICheckerProductDTO'

import { validateDateOnRequests } from '@/utils/validateDateOnRequests'
import { ValidateMessagesEnum } from '@/enums/all.enum'

export const IGetOrderDTO = z
  .object({
    clientId: z.string().uuid().optional(),
    employeeId: z.string().uuid().optional(),
    number: z.number().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    payDate: z.string().refine((val) => validateDateOnRequests(val), {
      message: ValidateMessagesEnum.DATE_ON_ISO,
    }),
    paymentMethod: z.string().optional(),
    price: z.number().optional(),
    description: z.string().optional(),
    orderItems: z.array(ICheckerProductDTO).optional(),
  })
  .strict()
