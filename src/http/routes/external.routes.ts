import { FastifyInstance } from 'fastify'

import { getClientNameByCPFController } from '../controllers/external/getClientNameByCPFController'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'

async function externalRoutes(app: FastifyInstance) {
  app.get(
    '/external-client-fetch-name/:CPF',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    getClientNameByCPFController,
  )
}

export { externalRoutes }
