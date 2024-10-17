import { z } from 'zod'

export const ICheckerEmployeeDTO = z.object({
  employeeId: z.string().uuid(),
})
