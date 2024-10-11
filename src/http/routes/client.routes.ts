import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { createClientController } from '../controllers/client/createClientController'

async function clientRoutes(app: FastifyInstance) {
  app.post(
    '/client',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    createClientController,
  )
}

export { clientRoutes }
