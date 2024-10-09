import { FastifyInstance } from 'fastify'
import multer from 'fastify-multer'

import { authenticateCompanyController } from '../controllers/company/authenticateCompanyController'
import { createCompanyController } from '../controllers/company/createCompanyController'
import { deleteCompanyController } from '../controllers/company/deleteCompanyController'
import { adminAuthenticatorMiddleware } from '../middlewares/adminAuthenticatorMiddleware'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { getCompanyController } from '../controllers/company/getCompanyController'
import { updateCompanyController } from '../controllers/company/updateCompanyController'
import { updateCompanyPasswordController } from '../controllers/company/updateCompanyPasswordController'
import { uploadCompanyImageController } from '../controllers/company/uploadCompanyImageController'
import { removeUploadedCompanyImageController } from '../controllers/company/removeUploadedCompanyImageController'

import { uploadConfig } from '@/config/upload'

async function companyRoutes(app: FastifyInstance) {
  const uploadImage = multer(uploadConfig)

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

  app.patch(
    '/company/upload-company-image',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        uploadImage.single('image'),
      ],
    },
    uploadCompanyImageController,
  )

  app.patch(
    '/company/remove-company-image',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    removeUploadedCompanyImageController,
  )
}

export { companyRoutes }
