import { FastifyInstance } from 'fastify'

import { healthCheckRoutes } from './routes/healthCheck.routes'
import { companyRoutes } from './routes/company.routes'
import { emailRoutes } from './routes/email.routes'
import { productRoutes } from './routes/product.routes'
import { clientRoutes } from './routes/client.routes'
import { addressRoutes } from './routes/address.routes'
import { employeeRoutes } from './routes/employee.routes'
import { orderRoutes } from './routes/order.routes'
import { nfeDataRoutes } from './routes/nfeData.routes'
import { orderItemRoutes } from './routes/orderItem.routes'
import { accessTokenRoutes } from './routes/accessToken.routes'
import { supplierRoutes } from './routes/supplier.routes'
import { serviceRoutes } from './routes/service.routes'
import { systemConfigRoutes } from './routes/systemConfig.routes'
import { paymentRoutes } from './routes/payment.routes'
import { externalRoutes } from './routes/external.routes'
import { nfceRoutes } from './routes/nfce.routes'

import { env } from '@/env'

async function appRoutes(app: FastifyInstance) {
  if (env.NODE_ENV !== 'production') {
    app.addHook('preHandler', async (request, _reply) => {
      if (request.url !== '/health-check') {
        console.log(`🔵 [${request.method}] ${request.url} 🔵`)
      }
    })
  }

  healthCheckRoutes(app)
  companyRoutes(app)
  emailRoutes(app)
  employeeRoutes(app)
  clientRoutes(app)
  supplierRoutes(app)
  productRoutes(app)
  orderRoutes(app)
  addressRoutes(app)
  orderItemRoutes(app)
  accessTokenRoutes(app)
  serviceRoutes(app)
  systemConfigRoutes(app)
  paymentRoutes(app)
  externalRoutes(app)

  // DISABLED ROUTES
  /*   nfceRoutes(app) */
  /*   nfeDataRoutes(app) */
}

export { appRoutes }
