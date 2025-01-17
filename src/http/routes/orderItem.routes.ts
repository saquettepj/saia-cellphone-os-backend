import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { emailConfirmationCheckerMiddleware } from '../middlewares/emailConfirmationCheckerMiddleware'
import { createOrderItemController } from '../controllers/orderItem/createOrderItemController'
import { getOrderItemController } from '../controllers/orderItem/getOrderItemController'
import { updateOrderItemController } from '../controllers/orderItem/updateOrderItemController'
import { deleteOrderItemController } from '../controllers/orderItem/deleteOrderItemController'
import { deleteManyOrderItemController } from '../controllers/orderItem/deleteManyOrderItemController'
import { productOnOthersCheckerByCompanyMiddleware } from '../middlewares/productOnOthersCheckerByCompanyMiddleware'
import { orderOnOthersCheckerByCompanyMiddleware } from '../middlewares/orderOnOthersCheckerByCompanyMiddleware'
import { orderItemCheckerByCompanyMiddleware } from '../middlewares/orderItemCheckerByCompanyMiddleware'

async function orderItemRoutes(app: FastifyInstance) {
  /*   app.post(
    '/order-item',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        orderOnOthersCheckerByCompanyMiddleware,
        productOnOthersCheckerByCompanyMiddleware,
      ],
    },
    createOrderItemController,
  ) */

  /*   app.post(
    '/order-item/list',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    getOrderItemController,
  ) */

  app.patch(
    '/order-item/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        orderItemCheckerByCompanyMiddleware,
      ],
    },
    updateOrderItemController,
  )

  app.delete(
    '/order-item/:id',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
        orderItemCheckerByCompanyMiddleware,
      ],
    },
    deleteOrderItemController,
  )

  app.post(
    '/order-item/delete-many',
    {
      preHandler: [
        companyAuthenticatorMiddleware,
        emailConfirmationCheckerMiddleware,
      ],
    },
    deleteManyOrderItemController,
  )
}

export { orderItemRoutes }
