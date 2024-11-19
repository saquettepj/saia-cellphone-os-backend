import { FastifyInstance } from 'fastify'

import { createServiceController } from '../controllers/service/createServiceController'
import { getServiceController } from '../controllers/service/getServiceController'
import { updateServiceController } from '../controllers/service/updateServiceController'
import { deleteServiceController } from '../controllers/service/deleteServiceController'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { serviceCheckerByCompanyMiddleware } from '../middlewares/serviceCheckerByCompanyMiddleware'

async function serviceRoutes(app: FastifyInstance) {
  app.post(
    '/service',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    createServiceController,
  )

  app.post(
    '/service/list',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    getServiceController,
  )

  app.patch(
    '/service/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        serviceCheckerByCompanyMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    updateServiceController,
  )

  app.delete(
    '/service/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        serviceCheckerByCompanyMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    deleteServiceController,
  )
}

export { serviceRoutes }
