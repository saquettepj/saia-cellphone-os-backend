import { FastifyInstance } from 'fastify'

import { createAccessTokenController } from '../controllers/accessToken/createAccessTokenController'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { adminAuthenticatorMiddleware } from '../middlewares/adminAuthenticatorMiddleware'
import { companyOnOthersOptionalCheckerMiddleware } from '../middlewares/companyOnOthersOptionalCheckerMiddleware'
import { getAccessTokenController } from '../controllers/accessToken/getAccessTokenController'
import { deleteAccessTokenController } from '../controllers/accessToken/deleteAccessTokenController'
import { updateAccessTokenController } from '../controllers/accessToken/updateAccessTokenController'

async function accessTokenRoutes(app: FastifyInstance) {
  app.post(
    '/access-token',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        adminAuthenticatorMiddleware,
        companyOnOthersOptionalCheckerMiddleware,
      ],
    },
    createAccessTokenController,
  )

  app.get(
    '/access-token',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        adminAuthenticatorMiddleware,
      ],
    },
    getAccessTokenController,
  )

  app.patch(
    '/access-token/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        adminAuthenticatorMiddleware,
      ],
    },
    updateAccessTokenController,
  )

  app.delete(
    '/access-token/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        adminAuthenticatorMiddleware,
      ],
    },
    deleteAccessTokenController,
  )
}

export { accessTokenRoutes }
