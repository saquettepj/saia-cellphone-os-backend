import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'

import { getGlobalLocale, setGlobalLocale } from '@/i18n/localeSetting'
import { ILocale } from '@/i18n/translate'

function localeMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) {
  const locale =
    (request.headers['accept-language']?.split(',')[0] as ILocale) || 'pt'

  if (getGlobalLocale() !== locale) {
    setGlobalLocale(locale)
  }

  done()
}

export { localeMiddleware }
