import { z } from 'zod'

export const ISimpleClientDTO = z.object({
  id: z.string().uuid(),
})
