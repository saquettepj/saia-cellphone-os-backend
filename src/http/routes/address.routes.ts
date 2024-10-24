import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { createAddressController } from '../controllers/address/createAddressController'
import { updateAddressController } from '../controllers/address/updateAddressController'
import { deleteAddressController } from '../controllers/address/deleteAddressController'
import { getAddressController } from '../controllers/address/getAddressController'

async function addressRoutes(app: FastifyInstance) {
  app.post(
    '/address',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    createAddressController,
  )

  app.post(
    '/address/list',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    getAddressController,
  )

  app.patch(
    '/address',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    updateAddressController,
  )

  app.delete(
    '/address/:id',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    deleteAddressController,
  )
}

export { addressRoutes }
