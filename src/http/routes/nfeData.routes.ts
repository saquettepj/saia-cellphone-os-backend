import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import {
  createOrUpdateNfeDataController,
  upload,
} from '../controllers/nfeData/createOrUpdateNfeDataController'
import { getNfeDataController } from '../controllers/nfeData/getNfeDataController'

async function nfeDataRoutes(app: FastifyInstance) {
  app.post(
    '/nfe-data/config',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        upload.single('file'),
      ],
    },
    createOrUpdateNfeDataController,
  )

  app.get(
    '/nfe-data/list',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    getNfeDataController,
  )
}

export { nfeDataRoutes }
