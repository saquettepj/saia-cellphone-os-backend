import { z } from 'zod'

export const IGetAddressDTO = z.object({
  clientId: z.string().uuid().optional(),
})

export type IGetAddressDTO = z.infer<typeof IGetAddressDTO>
