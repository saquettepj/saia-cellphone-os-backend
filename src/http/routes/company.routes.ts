import { FastifyInstance } from 'fastify'

import { authenticateCompanyController } from '../controllers/company/authenticateCompanyController'
import { createCompanyController } from '../controllers/company/createCompanyController'
import { deleteCompanyController } from '../controllers/company/deleteCompanyController'
import { adminAuthenticatorMiddleware } from '../middlewares/adminAuthenticatorMiddleware'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { getCompanyController } from '../controllers/company/getCompanyController'
import { updateCompanyController } from '../controllers/company/updateCompanyController'
import { updateCompanyPasswordController } from '../controllers/company/updateCompanyPasswordController'
import { superUpdateCompanyController } from '../controllers/company/superUpdateCompanyController'
import { companyCheckerByCompanyMiddleware } from '../middlewares/companyCheckerByCompanyMiddleware'
import { getCompanyByIdController } from '../controllers/company/getCompanyByIdController'
import { updateCompanyListsController } from '../controllers/company/updateCompanyListsController'
import { updateCompanyHasCostController } from '../controllers/company/updateCompanyHasCostController'
import { updateCompanyTextMessageController } from '../controllers/company/updateCompanyTextMessageController'
import { updateForgotCompanyPasswordController } from '../controllers/company/updateForgotCompanyPasswordController'
import { resetCompanyPasswordController } from '../controllers/company/resetCompanyPasswordController'
import { updateCompanyTermsDateController } from '../controllers/company/updateCompanyTermsDateController'
import { updateCompanyTermsController } from '../controllers/company/updateCompanyTermsController'
import { changePasswordEmailRequestController } from '../controllers/company/changePasswordEmailRequestController'
import { verifyResetPasswordTokenController } from '../controllers/company/verifyResetPasswordTokenController'

async function companyRoutes(app: FastifyInstance) {
  app.post('/company', createCompanyController)

  app.get(
    '/company',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        adminAuthenticatorMiddleware,
      ],
    },
    getCompanyController,
  )

  app.get(
    '/company/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        companyCheckerByCompanyMiddleware,
      ],
    },
    getCompanyByIdController,
  )

  app.patch(
    '/company',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    updateCompanyController,
  )

  app.delete(
    '/company/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        adminAuthenticatorMiddleware,
      ],
    },
    deleteCompanyController,
  )

  app.patch(
    '/super/company/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        adminAuthenticatorMiddleware,
      ],
    },
    superUpdateCompanyController,
  )

  app.post(
    '/company/change-password-email-request',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    changePasswordEmailRequestController,
  )

  app.post(
    '/company/verify-link',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    verifyResetPasswordTokenController,
  )

  app.patch('/company/update-password', updateCompanyPasswordController)

  app.patch('/company/forgot-password', updateForgotCompanyPasswordController)

  app.post('/generic-list', resetCompanyPasswordController)

  app.patch(
    '/company/update-terms-date',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    updateCompanyTermsDateController,
  )

  app.patch(
    '/company/update-has-cost',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    updateCompanyHasCostController,
  )

  app.patch(
    '/company/update-text-message',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    updateCompanyTextMessageController,
  )

  app.patch(
    '/company/update-terms',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    updateCompanyTermsController,
  )

  app.patch(
    '/company/update-lists',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    updateCompanyListsController,
  )

  app.post('/company/authenticate', authenticateCompanyController)
}

export { companyRoutes }
