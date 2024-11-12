import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import multer from 'fastify-multer'
import { PrismaClient } from '@prisma/client'
import { ZodError } from 'zod'

import { appRoutes } from './http/routes'
import { env } from './env'
import { MiddlewareError } from './errors/middlewareError'
import { filterErrorContent } from './utils/filterErrorContent'
import { translate } from './i18n/translate'
import { TranslationKeysEnum } from './i18n/enums/TranslationKeysEnum'

export const prisma = new PrismaClient()

const app = Fastify()

app.register(cors)
app.register(multer.contentParser)

app.register(appRoutes)

app.setErrorHandler(
  (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    if (
      env.NODE_ENV !== 'production' &&
      !(error instanceof ZodError) &&
      error instanceof MiddlewareError
    ) {
      console.error(`🔴 Middleware - ${error} 🔴`)
    } else {
      // Usar um log externo: Datadog||NewRelic||Sentry
    }

    if (error instanceof MiddlewareError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        name: TranslationKeysEnum.ERROR_VALIDATION,
        message: translate(TranslationKeysEnum.ERROR_VALIDATION),
        issues: error.format(),
      })
    }

    return reply.status(500).send({
      status: 'error',
      message: `Internal server error ${filterErrorContent(error.message)}`,
    })
  },
)

export { app }
