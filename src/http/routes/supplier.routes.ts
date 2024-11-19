import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { createSupplierController } from '../controllers/supplier/createSupplierController'
import { updateSupplierController } from '../controllers/supplier/updateSupplierController'
import { deleteSupplierController } from '../controllers/supplier/deleteSupplierController'
import { getSupplierController } from '../controllers/supplier/getSupplierController'
import { supplierCheckerByCompanyMiddleware } from '../middlewares/supplierCheckerByCompanyMiddleware'

async function supplierRoutes(app: FastifyInstance) {
  app.post(
    '/supplier',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    createSupplierController,
  )

  app.post(
    '/supplier/list',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    getSupplierController,
  )

  app.patch(
    '/supplier/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        supplierCheckerByCompanyMiddleware,
      ],
    },
    updateSupplierController,
  )

  app.delete(
    '/supplier/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        supplierCheckerByCompanyMiddleware,
      ],
    },
    deleteSupplierController,
  )
}

export { supplierRoutes }
