import { z } from 'zod'

export const ISimpleAddressDTO = z.object({
  id: z.string().uuid(),
})
