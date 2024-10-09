import { FastifyInstance } from 'fastify'

import { confirmEmailController } from '../controllers/email/confirmEmailController'
import { sendEmailConfirmationController } from '../controllers/email/sendEmailConfirmationController.ts'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'

async function emailRoutes(app: FastifyInstance) {
  app.post(
    '/email/send-confirmation',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    sendEmailConfirmationController,
  )
  app.patch(
    '/email/confirm',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    confirmEmailController,
  )
}

export { emailRoutes }
