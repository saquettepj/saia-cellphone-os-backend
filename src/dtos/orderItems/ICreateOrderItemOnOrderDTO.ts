import { z } from 'zod'

import { ICreateServiceOnOrderItemDTO } from '../service/ICreateServiceOnOrderItemDTO'

export const ICreateOrderItemOnOrderDTO = z
  .object({
    productId: z.string().uuid(),
    quantity: z.number().min(1),
    discount: z.number().optional(),
    service: ICreateServiceOnOrderItemDTO.optional(),
  })
  .strict()
