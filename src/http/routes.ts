import { FastifyInstance } from 'fastify'

import { companyRoutes } from './routes/company.routes'
import { emailRoutes } from './routes/email.routes'
import { productRoutes } from './routes/product.routes'
import { clientRoutes } from './routes/client.routes'

import { env } from '@/env'

async function appRoutes(app: FastifyInstance) {
  if (env.NODE_ENV !== 'production') {
    app.addHook('preHandler', async (request, _reply) => {
      console.log(`🔵 [${request.method}] ${request.url} 🔵`)
    })
  }

  companyRoutes(app)
  emailRoutes(app)
  productRoutes(app)
  clientRoutes(app)
}

export { appRoutes }
