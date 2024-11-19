import { z } from 'zod'

export const ICheckerSupplierDTO = z.object({
  supplierId: z.string().uuid(),
})
