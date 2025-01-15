import { FastifyInstance } from 'fastify'

import { confirmEmailController } from '../controllers/email/confirmEmailController'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { sendEmailConfirmationController } from '../controllers/email/sendEmailConfirmationController'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { sendSupportEmailController } from '../controllers/email/sendSupportEmailController'

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
  app.post(
    '/email/support',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    sendSupportEmailController,
  )
}

export { emailRoutes }
