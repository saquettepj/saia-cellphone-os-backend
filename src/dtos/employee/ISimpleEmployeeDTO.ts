import { z } from 'zod'

export const ISimpleEmployeeDTO = z.object({
  id: z.string().uuid(),
})
