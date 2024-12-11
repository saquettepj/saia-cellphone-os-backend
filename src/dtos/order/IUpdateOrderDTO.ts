import { z } from 'zod'

import { IUpdateOrderItemOnOrderDTO } from '../orderItems/IUpdateOrderItemOnOrderDTO'

import { validateDateOnRequests } from '@/utils/validateDateOnRequests'
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  ValidateMessagesEnum,
} from '@/enums/all.enum'

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
    description: z.string().optional(),
    orderItems: z.array(IUpdateOrderItemOnOrderDTO).nonempty().optional(),
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
