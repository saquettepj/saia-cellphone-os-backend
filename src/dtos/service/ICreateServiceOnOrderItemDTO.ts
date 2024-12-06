import { z } from 'zod'

export const ICreateServiceOnOrderItemDTO = z
  .object({
    employeeId: z.string().uuid().optional(),
  })
  .strict()
