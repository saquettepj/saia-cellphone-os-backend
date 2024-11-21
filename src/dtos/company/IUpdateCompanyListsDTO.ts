import { z } from 'zod'

import { validateCommaSeparatedStrings } from '@/utils/formatCommaSeparatedStrings'

export const IUpdateCompanyListsDTO = z
  .object({
    lists: z
      .array(
        z.string().refine(validateCommaSeparatedStrings, {
          message:
            'Each item in the string must be non-empty and separated by commas.',
        }),
      )
      .optional()
      .default([]),
  })
  .strict()
