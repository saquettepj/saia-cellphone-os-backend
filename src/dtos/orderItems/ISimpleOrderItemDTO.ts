import { z } from 'zod'

export const ISimpleOrderItemDTO = z.object({
  id: z.string().uuid(),
})

export const ISimpleArrayOrderItemDTO = z.object({
  ids: z.string().uuid().array(),
})
