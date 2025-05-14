import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { createClientController } from '../controllers/client/createClientController'
import { updateClientController } from '../controllers/client/updateClientController'
import { deleteClientController } from '../controllers/client/deleteClientController'
import { getClientController } from '../controllers/client/getClientController'
import { clientCheckerByCompanyMiddleware } from '../middlewares/clientCheckerByCompanyMiddleware'
import {
  importClientsController,
  upload,
} from '../controllers/client/importClientsController'

async function clientRoutes(app: FastifyInstance) {
  app.post(
    '/client',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    createClientController,
  )

  app.post(
    '/clients/import',
    {
      preHandler: [companyAuthenticatorMiddleware, upload.single('file')],
    },
    importClientsController,
  )

  /*   app.post(
    '/client/list',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    getClientController,
  ) */

  app.patch(
    '/client/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        clientCheckerByCompanyMiddleware,
      ],
    },
    updateClientController,
  )

  app.delete(
    '/client/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        clientCheckerByCompanyMiddleware,
      ],
    },
    deleteClientController,
  )
}

export { clientRoutes }
