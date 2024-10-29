import { FastifyInstance } from 'fastify'

import { createOrderController } from '../controllers/order/createOrderController'
import { getOrderController } from '../controllers/order/getOrderController'
import { deleteOrderController } from '../controllers/order/deleteOrderController'
import { updateOrderController } from '../controllers/order/updateOrderController'
import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { clientOnOthersCheckerByCompanyMiddleware } from '../middlewares/clientOnOthersCheckerByCompanyMiddleware'
import { orderCheckerByCompanyMiddleware } from '../middlewares/orderCheckerByCompanyMiddleware'
import { orderItemsOnOthersCheckerByCompanyMiddleware } from '../middlewares/orderItemsOnOthersCheckerByCompanyMiddleware'
import { employeeOnOthersCheckerByCompanyMiddleware } from '../middlewares/employeeOnOthersCheckerByCompanyMiddleware'

async function orderRoutes(app: FastifyInstance) {
  app.post(
    '/order',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        employeeOnOthersCheckerByCompanyMiddleware,
        clientOnOthersCheckerByCompanyMiddleware,
        orderItemsOnOthersCheckerByCompanyMiddleware,
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
        employeeOnOthersCheckerByCompanyMiddleware,
        clientOnOthersCheckerByCompanyMiddleware,
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
