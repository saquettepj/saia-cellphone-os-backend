import { z } from 'zod'

export const IGetOrderDTO = z
  .object({
    IMEI: z.string().optional(),
    clientId: z.string().uuid().optional(),
    employeeId: z.string().uuid().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    paymentMethod: z.string().optional(),
    paymentStatus: z.string().optional(),
    dueDate: z.number().optional(),
    numberOfInstallments: z.number().optional(),
    interest: z.number().optional(),
    price: z.number().optional(),
    description: z.string().optional(),
  })
  .strict()
