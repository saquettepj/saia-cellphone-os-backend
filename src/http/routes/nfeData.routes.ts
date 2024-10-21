import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { updateNfeDataCertificateController } from '../controllers/nfe/updateNfeDataCertificateController'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { createNfeDataController } from '../controllers/nfeData/createNfeDataController'
import { getNfeDataController } from '../controllers/nfeData/getNfeDataController'
import { deleteNfeDataController } from '../controllers/nfeData/deleteNfeDataController'
import { updateNfeDataController } from '../controllers/nfeData/updateNfeDataController'
import { nfeDataCheckerByCompanyMiddleware } from '../middlewares/nfeDataCheckerByCompanyMiddleware'

async function nfeDataRoutes(app: FastifyInstance) {
  app.post(
    '/nfe-data',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    createNfeDataController,
  )

  app.post(
    '/nfe-data/list',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    getNfeDataController,
  )

  app.patch(
    '/nfe-data/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        nfeDataCheckerByCompanyMiddleware,
      ],
    },
    updateNfeDataController,
  )

  app.delete(
    '/nfe-data/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        nfeDataCheckerByCompanyMiddleware,
      ],
    },
    deleteNfeDataController,
  )

  app.patch(
    '/nfe-data/certificate',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    updateNfeDataCertificateController,
  )
}

export { nfeDataRoutes }
