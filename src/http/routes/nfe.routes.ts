import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { updateNfeDataCertificateController } from '../controllers/nfe/updateNfeDataCertificateController'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'

async function emailRoutes(app: FastifyInstance) {
  app.patch(
    '/nfe/certificate',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    updateNfeDataCertificateController,
  )
}

export { emailRoutes }
