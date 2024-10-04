import { z } from 'zod'

export const ISimpleProductDTO = z.object({
  uuid: z.string().uuid(),
})