import { z } from 'zod'

export const IUpdateCompanyTextMessageDTO = z
  .object({
    textMessage: z.string(),
  })
  .strict()
