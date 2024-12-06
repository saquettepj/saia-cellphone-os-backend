import { z } from 'zod'

import { ServiceStatusEnum } from '@/enums/all.enum'

export const ICreateServiceDTO = z
  .object({
    orderItemId: z.string().uuid(),
    employeeId: z.string().uuid().optional(),
    status: z.nativeEnum(ServiceStatusEnum).default(ServiceStatusEnum.PENDING),
    report: z.string().optional(),
  })
  .strict()
