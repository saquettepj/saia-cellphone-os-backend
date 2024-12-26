import { z } from 'zod'

import { ServiceStatusEnum } from '@/enums/all.enum'

export const IUpdateServiceDTO = z
  .object({
    orderItemId: z.string().uuid(),
    employeeId: z.string().uuid().optional(),
    status: z.nativeEnum(ServiceStatusEnum).optional(),
    report: z.string().optional(),
  })
  .strict()
