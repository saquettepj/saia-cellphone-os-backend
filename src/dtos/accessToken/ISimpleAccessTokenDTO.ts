import { z } from 'zod'

export const ISimpleAccessTokenDTO = z.object({
  id: z.string().uuid(),
})
