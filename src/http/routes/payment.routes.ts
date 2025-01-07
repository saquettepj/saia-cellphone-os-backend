import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { createPaymentController } from '../controllers/payment/createPaymentController'
import { getPaymentStatusController } from '../controllers/payment/getPaymentStatusController'

async function paymentRoutes(app: FastifyInstance) {
  app.post(
    '/process_payment',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    createPaymentController,
  )

  app.get(
    '/payment-status',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    getPaymentStatusController,
  )
}

export { paymentRoutes }
