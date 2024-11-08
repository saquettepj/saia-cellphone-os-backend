import { z } from 'zod'

export const IOptionalCheckerCompanyDTO = z.object({
  companyId: z.string().uuid().optional(),
})
