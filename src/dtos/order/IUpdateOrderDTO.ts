import { z } from 'zod'

import {
  OrderStatusEnum,
  OrderTypeEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  ValidateMessagesEnum,
} from '@/enums/all.enum'
import { validateDateOnRequests } from '@/utils/validateDateOnRequests'

export const IUpdateOrderDTO = z
  .object({
    IMEI: z.string().min(1).optional(),
    clientId: z.string().uuid().optional(),
    employeeId: z.string().uuid().optional(),
    type: z.nativeEnum(OrderTypeEnum).optional(),
    status: z.nativeEnum(OrderStatusEnum).optional(),
    payDate: z
      .string()
      .refine((val) => validateDateOnRequests(val), {
        message: ValidateMessagesEnum.DATE_ON_ISO,
      })
      .optional(),
    paymentMethod: z.nativeEnum(PaymentMethodEnum).optional(),
    paymentStatus: z.nativeEnum(PaymentStatusEnum).optional(),
    firstDueDate: z
      .string()
      .refine((val) => validateDateOnRequests(val), {
        message: ValidateMessagesEnum.DATE_ON_ISO,
      })
      .optional(),
    dueDate: z.number().min(1).optional(),
    numberOfInstallments: z.number().min(1).optional(),
    interest: z.number().min(0).optional(),
    price: z.number().optional(),
    description: z.string().optional(),
  })
  .strict()
