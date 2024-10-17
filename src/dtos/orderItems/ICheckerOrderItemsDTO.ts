import { z } from 'zod'

import { ICheckerProductDTO } from '../product/ICheckerProductDTO'

export const ICheckerOrderItemsDTO = z.object({
  orderItems: z.array(ICheckerProductDTO).nonempty(),
})
