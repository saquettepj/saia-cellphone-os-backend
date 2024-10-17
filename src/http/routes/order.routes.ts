import { FastifyInstance } from 'fastify'

import { createOrderController } from '../controllers/order/createOrderController'
import { getOrderController } from '../controllers/order/getOrderController'
import { deleteOrderController } from '../controllers/order/deleteOrderController'
import { updateOrderController } from '../controllers/order/updateOrderController'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { employeeCheckerByCompanyMiddleware } from '../middlewares/employeeCheckerByCompanyMiddleware'
import { clientCheckerByCompanyMiddleware } from '../middlewares/clientCheckerByCompanyMiddleware'
import { orderCheckerByCompanyMiddleware } from '../middlewares/orderCheckerByCompanyMiddleware'
import { orderItemsCheckerByCompanyMiddleware } from '../middlewares/orderItemsCheckerByCompanyMiddleware'

async function orderRoutes(app: FastifyInstance) {
  app.post(
    '/order',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        employeeCheckerByCompanyMiddleware,
        clientCheckerByCompanyMiddleware,
        orderItemsCheckerByCompanyMiddleware,
      ],
    },
    createOrderController,
  )

  app.post(
    '/order/list',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    getOrderController,
  )

  app.patch(
    '/order/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        orderCheckerByCompanyMiddleware,
        employeeCheckerByCompanyMiddleware,
        clientCheckerByCompanyMiddleware,
      ],
    },
    updateOrderController,
  )

  app.delete(
    '/order/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        orderCheckerByCompanyMiddleware,
      ],
    },
    deleteOrderController,
  )
}

export { orderRoutes }
