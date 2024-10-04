import z from "zod"

export const ICreateProductDTO = z.object({
  name: z.string().trim().min(6),
  price: z.number().gt(0)
})