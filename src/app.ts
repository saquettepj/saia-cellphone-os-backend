import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { ZodError } from 'zod'

import { appRoutes } from './http/routes'
import { env } from './env'
import { MiddlewareError } from './errors/middlewareError'
import { filterErrorContent } from './utils/filterErrorContent'
import { translate } from './i18n/translate'
import { TranslationKeysEnum } from './i18n/enums/TranslationKeysEnum'
import { localeMiddleware } from './http/middlewares/global/localeMiddleware'

export const prisma = new PrismaClient()

const app = Fastify()

app.register(cors)

app.addHook('preHandler', localeMiddleware)
app.register(appRoutes)

app.setErrorHandler(
  (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof MiddlewareError) {
      env.NODE_ENV !== 'production' &&
        console.error(`🔴 Middleware - ${error} 🔴`) // Usar um log externo: Datadog||NewRelic||Sentry

      return reply
        .status(error.statusCode)
        .send({ name: error.name, message: error.message })
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        name: TranslationKeysEnum.ERROR_VALIDATION,
        message: translate(TranslationKeysEnum.ERROR_VALIDATION),
        issues: error.format(),
      })
    }

    return reply.status(500).send({
      name: TranslationKeysEnum.ERROR_ON_SERVER,
      status: 'error',
      message: `Internal server error ${env.NODE_ENV !== 'test' ? filterErrorContent(error.message) : error.message}`,
    })
  },
)

export { app }
