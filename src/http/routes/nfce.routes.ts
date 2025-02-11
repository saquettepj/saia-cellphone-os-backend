import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { createNfceController } from '../controllers/nfce/createNfceController'
import { nfeDataCheckerByCompanyMiddleware } from '../middlewares/nfeDataCheckerByCompanyMiddleware'
import { orderOnOthersCheckerByCompanyMiddleware } from '../middlewares/orderOnOthersCheckerByCompanyMiddleware'
import { cancelNfceController } from '../controllers/nfce/cancelNfceController'

async function nfceRoutes(app: FastifyInstance) {
  app.post(
    '/nfce/create',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        nfeDataCheckerByCompanyMiddleware,
        orderOnOthersCheckerByCompanyMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    createNfceController,
  )

  app.patch(
    '/nfce/cancel',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        nfeDataCheckerByCompanyMiddleware,
        orderOnOthersCheckerByCompanyMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    cancelNfceController,
  )
}

export { nfceRoutes }
