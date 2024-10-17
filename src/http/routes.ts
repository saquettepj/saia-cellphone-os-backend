import { FastifyInstance } from 'fastify'

import { companyRoutes } from './routes/company.routes'
import { emailRoutes } from './routes/email.routes'
import { productRoutes } from './routes/product.routes'
import { clientRoutes } from './routes/client.routes'
import { addressRoutes } from './routes/address.routes'
import { employeeRoutes } from './routes/employee.routes'
import { orderRoutes } from './routes/order.routes'

import { env } from '@/env'

async function appRoutes(app: FastifyInstance) {
  if (env.NODE_ENV !== 'production') {
    app.addHook('preHandler', async (request, _reply) => {
      console.log(`🔵 [${request.method}] ${request.url} 🔵`)
    })
  }

  companyRoutes(app)
  emailRoutes(app)
  employeeRoutes(app)
  clientRoutes(app)
  productRoutes(app)
  orderRoutes(app)
  addressRoutes(app)
}

export { appRoutes }
