import { z } from 'zod'

import { ICreateOrderItemOnOrderDTO } from '../orderItems/ICreateOrderItemOnOrderDTO'

import { validateDateOnRequests } from '@/utils/validateDateOnRequests'
import {
  OrderTypeEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  ValidateMessagesEnum,
} from '@/enums/all.enum'

export const ICreateOrderDTO = z
  .object({
    IMEI: z.string().min(1).optional(),
    clientId: z.string().uuid(),
    employeeId: z.string().uuid(),
    type: z.nativeEnum(OrderTypeEnum),
    status: z.string(),
    payDate: z
      .string()
      .refine((val) => validateDateOnRequests(val), {
        message: ValidateMessagesEnum.DATE_ON_ISO,
      })
      .optional(),
    paymentMethod: z.nativeEnum(PaymentMethodEnum),
    paymentStatus: z.nativeEnum(PaymentStatusEnum),
    firstDueDate: z
      .string()
      .refine((val) => validateDateOnRequests(val), {
        message: ValidateMessagesEnum.DATE_ON_ISO,
      })
      .optional(),
    dueDate: z.number().min(1).optional(),
    numberOfInstallments: z.number().min(1).optional(),
    interest: z.number().min(0).optional(),
    price: z.number(),
    description: z.string().default(''),
    orderItems: z.array(ICreateOrderItemOnOrderDTO).nonempty(),
  })
  .strict()
  .refine(
    (data) =>
      data.paymentMethod !== PaymentMethodEnum.INSTALLMENTS ||
      (data.firstDueDate &&
        data.dueDate &&
        data.numberOfInstallments &&
        data.interest !== undefined),
    {
      message:
        'Fields firstDueDate, dueDate, numberOfInstallments, and interest are required for the payment method INSTALLMENTS.',
      path: ['paymentMethod'],
    },
  )
  .refine(
    (data) =>
      data.paymentMethod === PaymentMethodEnum.INSTALLMENTS ||
      (!data.firstDueDate &&
        !data.dueDate &&
        !data.numberOfInstallments &&
        !data.interest),
    {
      message:
        'Fields firstDueDate, dueDate, numberOfInstallments, and interest must be undefined for payment methods other than INSTALLMENTS.',
      path: ['paymentMethod'],
    },
  )
