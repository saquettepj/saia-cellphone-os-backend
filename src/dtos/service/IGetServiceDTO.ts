import { z } from 'zod'

import { ServiceStatusEnum } from '@/enums/all.enum'

export const IGetServiceDTO = z
  .object({
    id: z.string().uuid().optional(),
    orderItemId: z.string().uuid().optional(),
    employeeId: z.string().uuid().optional(),
    status: z.nativeEnum(ServiceStatusEnum).optional(),
    report: z.string().optional(),
  })
  .strict()
