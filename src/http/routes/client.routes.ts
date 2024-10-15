import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { createClientController } from '../controllers/client/createClientController'
import { updateClientController } from '../controllers/client/updateClientController'
import { deleteClientController } from '../controllers/client/deleteClientController'
import { getClientController } from '../controllers/client/getClientController'

async function clientRoutes(app: FastifyInstance) {
  app.post(
    '/client',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    createClientController,
  )

  app.post(
    '/clients/list',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    getClientController,
  )

  app.patch(
    '/client/:id',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    updateClientController,
  )

  app.delete(
    '/client/:id',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    deleteClientController,
  )
}

export { clientRoutes }
