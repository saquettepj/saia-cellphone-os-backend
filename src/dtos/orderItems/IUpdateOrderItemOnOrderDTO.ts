import { z } from 'zod'

import { ICreateServiceOnOrderItemDTO } from '../service/ICreateServiceOnOrderItemDTO'

export const IUpdateOrderItemOnOrderDTO = z
  .object({
    id: z.string().uuid().optional(),
    productId: z.string().uuid(),
    quantity: z.number().min(1).optional(),
    discount: z.number().optional(),
    service: ICreateServiceOnOrderItemDTO.optional(),
  })
  .strict()
