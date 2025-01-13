import { z } from 'zod'

export const IUpdateCompanyTermsDTO = z
  .object({
    companyTerms: z.string(),
  })
  .strict()
