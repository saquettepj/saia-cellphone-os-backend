import { FastifyInstance } from 'fastify'

import { updateSystemConfigController } from '../controllers/systemConfig/updateSystemConfigController'
import { adminAuthenticatorMiddleware } from '../middlewares/adminAuthenticatorMiddleware'
import { getSystemConfigController } from '../controllers/systemConfig/getSystemConfigController'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'

async function systemConfigRoutes(app: FastifyInstance) {
  app.get('/system-config', getSystemConfigController)

  app.patch(
    '/system-config',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        adminAuthenticatorMiddleware,
      ],
    },
    updateSystemConfigController,
  )
}

export { systemConfigRoutes }
