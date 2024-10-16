import { FastifyInstance } from 'fastify'

import { companyAuthenticatorMiddleware } from '../middlewares/companyAuthenticatorMiddleware'
import { createEmployeeController } from '../controllers/employee/createEmployeeController'
import { updateEmployeeController } from '../controllers/employee/updateEmployeeController'
import { deleteEmployeeController } from '../controllers/employee/deleteEmployeeController'
import { getEmployeeController } from '../controllers/employee/getEmployeeController'

async function employeeRoutes(app: FastifyInstance) {
  app.post(
    '/employee',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    createEmployeeController,
  )

  app.post(
    '/employee/list',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    getEmployeeController,
  )

  app.patch(
    '/employee/:id',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    updateEmployeeController,
  )

  app.delete(
    '/employee/:id',
    {
      preHandler: [companyAuthenticatorMiddleware],
    },
    deleteEmployeeController,
  )
}

export { employeeRoutes }
