import { File } from 'fastify-multer/lib/interfaces'

declare module 'fastify' {
  interface FastifyRequest {
    company: {
      name: string
      id: string
    }
    file: File
  }
}
