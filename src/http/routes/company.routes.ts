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
import { updateCompanyTermsController } from '../controllers/company/updateCompanyTermsController'
import { companyCheckerByCompanyMiddleware } from '../middlewares/companyCheckerByCompanyMiddleware'
import { getCompanyByIdController } from '../controllers/company/getCompanyByIdController'

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
    '/super/company/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        adminAuthenticatorMiddleware,
      ],
    },
    superUpdateCompanyController,
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

  app.patch(
    '/company/update-terms',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    updateCompanyTermsController,
  )

  app.post('/company/authenticate', authenticateCompanyController)
}

export { companyRoutes }
