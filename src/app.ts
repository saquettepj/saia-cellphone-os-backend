import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import multer from 'fastify-multer'
import { PrismaClient } from '@prisma/client'
import { ZodError } from 'zod'

import { appRoutes } from './http/routes'
import { env } from './env'
import { MiddlewareError } from './errors/middlewareError'

export const prisma = new PrismaClient()

const app = Fastify()

app.register(cors)
app.register(multer.contentParser)

app.register(appRoutes)

app.setErrorHandler(
  (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    if (env.NODE_ENV !== 'production' && !(error instanceof ZodError)) {
      console.error(
        `🔴 ${
          error instanceof MiddlewareError ? 'Middleware' : ''
        } ${error} 🔴`,
      )
    } else {
      // Usar um log externo: Datadog||NewRelic||Sentry
    }

    if (error instanceof MiddlewareError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }

    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Validation Error', issues: error.format() })
    }

    return reply.status(500).send({
      status: 'error',
      message: `Internal server error - ${error.message}`,
    })
  },
)

export { app }
