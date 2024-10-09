import { z } from 'zod'

export const ISimpleProductDTO = z.object({
  id: z.string().uuid(),
})

export const ISimpleArrayProductDTO = z.object({
  ids: z.string().uuid().array(),
})
