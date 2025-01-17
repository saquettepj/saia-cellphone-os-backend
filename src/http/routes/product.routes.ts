import { FastifyInstance } from 'fastify'

import { createProductController } from '../controllers/product/createProductController'
import { getProductController } from '../controllers/product/getProductController'
import { deleteProductController } from '../controllers/product/deleteProductController'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { updateProductController } from '../controllers/product/updateProductController'
import { deleteManyProductController } from '../controllers/product/deleteManyProductController'
import { productCheckerByCompanyMiddleware } from '../middlewares/productCheckerByCompanyMiddleware'

async function productRoutes(app: FastifyInstance) {
  app.post(
    '/product',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    createProductController,
  )

  /*   app.post(
    '/product/list',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    getProductController,
  ) */

  app.patch(
    '/product/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        productCheckerByCompanyMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    updateProductController,
  )

  app.delete(
    '/product/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        productCheckerByCompanyMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    deleteProductController,
  )

  app.post(
    '/product/delete-by-ids',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    deleteManyProductController,
  )
}

export { productRoutes }
