import { z } from 'zod'

export const IUpdateNfeDataCertificateDTO = z.object({
  id: z.string().uuid(),
  certificateKey: z.string().min(8).max(16),
  serializedCertificate: z.string(),
})
