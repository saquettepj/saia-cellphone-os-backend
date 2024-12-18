import { z } from 'zod'

import { TranslationKeysEnum } from '@/i18n/enums/TranslationKeysEnum'

export const ICheckListSchema = z.object({
  name: z.string().min(1),
  input: z.array(z.string()).nonempty(),
  pin: z.boolean().optional(),
})

export const IUpdateCompanyListsDTO = z
  .object({
    lists: z
      .array(
        z.string().refine((list) => {
          try {
            const parsedList = JSON.parse(list)
            ICheckListSchema.parse(parsedList)
            return true
          } catch {
            return false
          }
        }, TranslationKeysEnum.ERROR_INVALID_JSON),
      )
      .optional(),
  })
  .strict()
