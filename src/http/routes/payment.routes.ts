import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { createPaymentController } from '../controllers/payment/createPaymentController'
import { getIPNPaymentNotificationController } from '../controllers/payment/getIPNPaymentNotification'

async function paymentRoutes(app: FastifyInstance) {
  app.post(
    '/process_payment',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    createPaymentController,
  )

  app.post(
    '/process_payment_notification',
    {},
    getIPNPaymentNotificationController,
  )
}

export { paymentRoutes }
