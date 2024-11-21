import { z } from 'zod'

import { ICreateServiceOnOrderItemDTO } from '../service/ICreateServiceOnOrderItemDTO'

export const ICreateOrderItemDTO = z
  .object({
    orderId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number().min(1),
    discount: z.number().optional(),
    service: ICreateServiceOnOrderItemDTO.optional(),
  })
  .strict()
