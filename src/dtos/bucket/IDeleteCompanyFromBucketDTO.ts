import { z } from 'zod'

export const IDeleteCompanyFromBucketDTO = z.object({
  imageNames: z.string().array(),
})
