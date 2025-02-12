import { FastifyInstance, FastifyReply } from 'fastify'

async function healthCheckRoutes(app: FastifyInstance) {
  app.get('/health-check', async (_, reply: FastifyReply) => {
    return reply.status(200).send()
  })
}

export { healthCheckRoutes }
