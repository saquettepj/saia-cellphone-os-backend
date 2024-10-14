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
    '/company',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    updateCompanyController,
  )

  app.patch(
    '/company/update-password',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    updateCompanyPasswordController,
  )

  app.post('/company/authenticate', authenticateCompanyController)
}

export { companyRoutes }
